"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, FileText, CheckCircle, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { WalletConnection } from "@/components/wallet-connection"
import { TokenClaim } from "@/components/token-claim"
import { GlowCard } from "@/components/spotlight-card"
import { useSocket } from "@/hooks/useSocket"
import { 
  getUserProfile, 
  formatFileSize,
  saveUploadedFile,
  type UploadedFile as StoredUploadedFile
} from "@/lib/user-manager"
import {
  GLACIER_CONTRACT_ADDRESS,
  GLACIER_PAYMENTS_ABI,
  calculateUploadCostInAVAX,
  calculateUploadCostInGLCR,
  formatAVAX,
  formatGLCR
} from "@/lib/glacier-contracts"

interface NetworkType {
  id: string
  name: string
  description: string
  uptime: number
  rateMultiplier: number
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  data: string
}

export function UploadInterface() {
  const { isConnected, address } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const { writeContract, data: hash, isPending: isContractPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  const { isConnected: socketConnected, providers: onlineProviders, sendFile, socket } = useSocket()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState<'basic' | 'premium' | 'enterprise'>('basic')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [username, setUsername] = useState("")
  const [uploadCostAVAX, setUploadCostAVAX] = useState<bigint>(BigInt(0))
  const [uploadCostGLCR, setUploadCostGLCR] = useState<number>(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  const networks: NetworkType[] = [
    { id: 'basic', name: 'Basic Network', description: 'Standard reliability', uptime: 95, rateMultiplier: 1.0 },
    { id: 'premium', name: 'Premium Network', description: 'High reliability', uptime: 98, rateMultiplier: 1.2 },
    { id: 'enterprise', name: 'Enterprise Network', description: 'Maximum uptime', uptime: 99.9, rateMultiplier: 1.5 },
  ]

  // Load user profile and redirect if not registered
  useEffect(() => {
    setMounted(true)
    const profile = getUserProfile()
    if (!profile) {
      // Not registered, redirect to registration
      router.push('/register')
      return
    }
    
    setUsername(profile.username)
  }, [router])

  // Calculate cost when file or network changes
  useEffect(() => {
    if (file) {
      const costAVAX = calculateUploadCostInAVAX(file.size)
      const costGLCR = calculateUploadCostInGLCR(file.size)
      setUploadCostAVAX(costAVAX)
      setUploadCostGLCR(costGLCR)
    } else {
      setUploadCostAVAX(BigInt(0))
      setUploadCostGLCR(0)
    }
  }, [file, selectedNetwork])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const encryptFile = async (fileData: string, password: string): Promise<string> => {
    try {
      // Convert base64 to ArrayBuffer
      const base64Data = fileData.split(',')[1] || fileData
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Derive key from password
      const encoder = new TextEncoder()
      const passwordBuffer = encoder.encode(password)
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      )

      // Use a fixed salt for simplicity (in production, generate random salt and include it)
      const salt = encoder.encode('glacier-salt-v1')
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      )

      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(12))

      // Encrypt
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        bytes
      )

      // Combine IV + encrypted data
      const encryptedBytes = new Uint8Array(encryptedBuffer)
      const combined = new Uint8Array(iv.length + encryptedBytes.length)
      combined.set(iv, 0)
      combined.set(encryptedBytes, iv.length)

      // Convert to base64 (chunk processing to avoid stack overflow)
      let binary = ''
      const chunkSize = 8192
      for (let i = 0; i < combined.length; i += chunkSize) {
        const chunk = combined.subarray(i, Math.min(i + chunkSize, combined.length))
        binary += String.fromCharCode.apply(null, Array.from(chunk))
      }
      const encryptedBase64 = btoa(binary)
      
      // Return with data URL prefix
      const mimeType = fileData.split(';')[0].split(':')[1] || 'application/octet-stream'
      return `data:${mimeType};base64,${encryptedBase64}`
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error('Failed to encrypt file')
    }
  }

  const handleUpload = async () => {
    if (!file || !password) {
      alert('Please select a file and enter a password')
      return
    }

    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    if (onlineProviders.length === 0) {
      alert('No providers online. Please wait for providers to connect.')
      return
    }

    // Check if user has enough AVAX
    const walletBalanceWei = balanceData?.value || BigInt(0)
    if (walletBalanceWei < uploadCostAVAX) {
      const requiredAVAX = Number(uploadCostAVAX) / 1e18
      const currentAVAX = Number(walletBalanceWei) / 1e18
      alert(`Insufficient balance. You need ${requiredAVAX.toFixed(4)} AVAX but only have ${currentAVAX.toFixed(4)} AVAX`)
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setShowSuccess(false)

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 30) {
            clearInterval(interval)
            return 30
          }
          return prev + 10
        })
      }, 200)

      // Encrypt file data
      console.log('🔐 Encrypting file...')
      const encryptedData = await encryptFile(base64, password)
      setUploadProgress(50)

      // Try to call smart contract if providers have wallet addresses
      console.log('💰 Checking for smart contract payment...')
      console.log('All providers:', JSON.stringify(onlineProviders, null, 2))
      console.log('Provider IDs:', onlineProviders.map(p => p.id))
      
      const providerAddresses = onlineProviders
        .filter(p => {
          const isValid = p.id && typeof p.id === 'string' && p.id.startsWith('0x')
          console.log(`Provider ${p.username}: id=${p.id}, isValid=${isValid}`)
          return isValid
        })
        .map(p => p.id as `0x${string}`)
      
      console.log('Filtered provider addresses:', providerAddresses)
      
      // Only call contract if we have valid addresses, otherwise skip payment
      if (providerAddresses.length > 0) {
        console.log('📝 Calling smart contract for payment...')
        writeContract({
          address: GLACIER_CONTRACT_ADDRESS,
          abi: GLACIER_PAYMENTS_ABI,
          functionName: 'uploadFile',
          args: [providerAddresses, BigInt(file.size)],
          value: uploadCostAVAX,
        })
      } else {
        console.log('⚠️ No wallet addresses found - skipping smart contract payment, sending file anyway')
      }

      setUploadProgress(70)

      // Get original file extension
      const fileExtension = file.name.split('.').pop() || 'bin'
      
      // Use socket ID as filename (will be set on server side)
      const encryptedFileName = `encrypted_${Date.now()}.${fileExtension}`
      
      // Send file via socket to all providers
      console.log('📡 Sending file via socket...')
      sendFile({
        fileData: base64,
        fileName: encryptedFileName, // Will be replaced with socket ID on server
        fileSize: file.size,
        fileType: file.type,
        senderUsername: username,
        encryptedData,
        cost: uploadCostGLCR,
        originalFileName: file.name,
      })

      // Complete progress
      setUploadProgress(90)
      console.log('✅ Upload complete!')
      setShowSuccess(true)
      
      // Save uploaded file to localStorage with encrypted data
      const uploadedFile: StoredUploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        providerCount: onlineProviders.length,
        cost: uploadCostGLCR,
        fileData: encryptedData, // Store encrypted data so user can download later
      }
      
      saveUploadedFile(uploadedFile)
      
      // Add to in-memory list for display
      const newFile: UploadedFile = {
        id: uploadedFile.id,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        data: encryptedData,
      }

      setUploadedFiles([...uploadedFiles, newFile])
      setShowSuccess(true)
      
      // Reset form
      setTimeout(() => {
        setUploading(false)
        setFile(null)
        setPassword("")
        setUploadProgress(0)
      }, 2000)

    } catch (error) {
      console.error('Upload failed:', error)
      setUploading(false)
      alert('Upload failed. Please try again.')
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
    }
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Upload to Glacier</h1>
              <p className="text-xl text-gray-300">
                Connect your MetaMask wallet to start uploading files to the decentralized storage network
              </p>
            </div>

            <GlowCard glowColor="ice" customSize={true} className="p-8 md:p-8 sm:p-4 border-2 border-blue-500/20">
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Wallet Connection Required</h3>
                  <p className="text-gray-300">
                    You need to connect your MetaMask wallet and claim GLCR tokens before uploading files
                  </p>
                </div>

                <div className="flex justify-center">
                  <WalletConnection />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-left">
                    <Upload className="w-5 h-5 text-white flex-shrink-0" />
                    <div>
                      <p className="font-medium">Secure Upload</p>
                      <p className="text-sm text-gray-400">Your files are encrypted and distributed across multiple nodes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <div>
                      <p className="font-medium">Free Tokens</p>
                      <p className="text-sm text-gray-400">Claim 1000 GLCR tokens to get started</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <FileText className="w-5 h-5 text-white flex-shrink-0" />
                    <div>
                      <p className="font-medium">Easy Management</p>
                      <p className="text-sm text-gray-400">View and manage all your files in the dashboard</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <Link href="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-2 sm:mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm sm:text-base">Back to Home</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Upload to Glacier</h1>
            <p className="text-gray-400 text-sm sm:text-base">Securely store your files across the decentralized network</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="order-2 sm:order-1">
              <WalletConnection />
            </div>
            <Link href="/dashboard" className="order-1 sm:order-2">
              <Button variant="outline" className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                View Dashboard
              </Button> 
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Upload Form */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6 order-1">
            {/* File Selection */}
            <GlowCard glowColor="glacier" customSize={true} className="p-6 sm:p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Select File
                  </h3>
                  <p className="text-gray-400">
                    Choose the file you want to store securely
                  </p>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-500/10 transform scale-[1.02]'
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/20'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2">
                    {file ? `Selected: ${file.name}` : 'Drop your file here or click to browse'}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Supports all file types up to 100MB
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      asChild
                      disabled={uploading}
                      size="lg"
                    >
                      <span>{file ? 'Change File' : 'Choose File'}</span>
                    </Button>
                  </label>
                </div>

                {file && (
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="password">Encryption Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    This password encrypts your file client-side. Keep it safe - we cannot recover it.
                  </p>
                </div>
              </div>
            </GlowCard>

            {/* Network Selection */}
            <GlowCard glowColor="deep" customSize={true} className="p-6 sm:p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Select Provider Network
                  </h3>
                  <p className="text-gray-400">Choose your storage reliability tier</p>
                </div>

                {/* Online Providers Count */}
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-400">Online Providers:</span>
                  <span className="text-lg font-bold text-green-400">{onlineProviders.length}</span>
                </div>

                {onlineProviders.length === 0 && (
                  <Alert className="border-yellow-500/50 bg-yellow-500/10">
                    <AlertDescription className="text-yellow-200 text-sm">
                      No providers online. Waiting for providers to connect...
                    </AlertDescription>
                  </Alert>
                )}

                {/* Network Tiers */}
                <div className="space-y-3">
                  {networks.map((network) => (
                    <div
                      key={network.id}
                      onClick={() => setSelectedNetwork(network.id as 'basic' | 'premium' | 'enterprise')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.01] ${
                        selectedNetwork === network.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{network.name}</h4>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-400">
                            {(0.001 * network.rateMultiplier).toFixed(4)} GLCR/MB
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{network.description}</span>
                        <span className="text-green-400 font-medium">{network.uptime}% uptime</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Display */}
                {file && (
                  <Alert className="border-blue-500/50 bg-blue-500/10">
                    <AlertDescription className="text-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Estimated Cost:</span>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatAVAX(uploadCostAVAX)}</div>
                          <div className="text-xs">≈ {uploadCostGLCR.toFixed(4)} GLCR</div>
                        </div>
                      </div>
                      <p className="text-xs text-blue-300 mt-1">
                        File will be distributed to all {onlineProviders.length} online provider{onlineProviders.length !== 1 ? 's' : ''}
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </GlowCard>

            {/* Upload Progress */}
            {uploading && (
              <GlowCard glowColor="arctic" customSize={true} className="p-6 sm:p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">
                      {uploadProgress === 100 && showSuccess ? "Upload Complete!" : "Uploading..."}
                    </h3>
                    <p className="text-gray-400">
                      {uploadProgress === 100 && showSuccess 
                        ? `Sent to ${onlineProviders.length} provider${onlineProviders.length !== 1 ? 's' : ''}`
                        : "Encrypting and distributing your file"
                      }
                    </p>
                  </div>

                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-400">
                    {uploadProgress < 30 && "Encrypting file with password..."}
                    {uploadProgress >= 30 && uploadProgress < 60 && "Preparing file data..."}
                    {uploadProgress >= 60 && uploadProgress < 90 && "Sending to providers..."}
                    {uploadProgress >= 90 && uploadProgress < 100 && "Finalizing upload..."}
                    {uploadProgress === 100 && showSuccess && (
                      <span className="text-green-400 font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Successfully uploaded!
                      </span>
                    )}
                  </p>
                </div>
              </GlowCard>
            )}

            {/* Recent Uploads */}
            {uploadedFiles.length > 0 && (
              <GlowCard glowColor="frost" customSize={true} className="p-6 sm:p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Recent Uploads</h3>
                    <p className="text-gray-400">
                      Your recently uploaded files ({uploadedFiles.length} total)
                    </p>
                  </div>

                  <div className="space-y-3">
                    {uploadedFiles.slice(-3).reverse().map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 hover:transform hover:scale-[1.01] cursor-pointer">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-white" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-gray-400">
                              {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              </GlowCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-2">
            {/* Balance Card */}
            <GlowCard glowColor="glacier" customSize={true} className="p-6 sm:p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="text-sm font-bold">Your Wallet Balance</h3>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {balanceData ? formatAVAX(balanceData.value) : '0.0000 AVAX'}
                </div>
                <div className="text-sm text-gray-400">
                  ≈ {balanceData ? formatGLCR(balanceData.value) : '0.0000 GLCR'}
                </div>
                <p className="text-xs text-gray-400">
                  {!username ? (
                    <Link href="/provider" className="text-blue-400 hover:text-blue-300">
                      Register to get started
                    </Link>
                  ) : (
                    `Logged in as ${username}`
                  )}
                </p>
              </div>
            </GlowCard>

            {/* Upload Summary */}
            <GlowCard glowColor="ice" customSize={true} className="p-6 sm:p-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Upload Summary</h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>File Size:</span>
                    <span>{file ? formatFileSize(file.size) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Online Providers:</span>
                    <span className="text-green-400 font-medium">{onlineProviders.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Selected Network:</span>
                    <span className="capitalize">{selectedNetwork}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Redundancy:</span>
                    <span>{onlineProviders.length > 1 ? "High" : onlineProviders.length === 1 ? "Medium" : "None"}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t border-gray-700 pt-2">
                    <span>Cost:</span>
                    <div className="text-right">
                      <div className={uploadCostAVAX > (balanceData?.value || BigInt(0)) ? 'text-red-400' : 'text-green-400'}>
                        {formatAVAX(uploadCostAVAX)}
                      </div>
                      <div className="text-xs text-gray-400">≈ {uploadCostGLCR.toFixed(4)} GLCR</div>
                    </div>
                  </div>
                  {uploadCostAVAX > (balanceData?.value || BigInt(0)) && file && (
                    <p className="text-xs text-red-400">
                      Insufficient AVAX balance
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!file || !password || !isConnected || onlineProviders.length === 0 || uploading || uploadCostAVAX > (balanceData?.value || BigInt(0)) || !username}
                  className="w-full transition-all duration-200 hover:transform hover:scale-[1.02] disabled:hover:scale-100"
                  size="lg"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isContractPending || isConfirming ? 'Confirming transaction...' : 'Uploading...'}
                    </span>
                  ) : !isConnected ? (
                    "Connect Wallet First"
                  ) : !username ? (
                    "Register First"
                  ) : (
                    "Upload File"
                  )}
                </Button>
              </div>
            </GlowCard>

            <GlowCard glowColor="glacier" customSize={true} className="p-6 sm:p-4">
              <div className="space-y-3">
                <h4 className="text-lg font-bold">How it Works</h4>
                
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>File encrypted with your password</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Split into chunks across providers</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Smart contracts ensure storage</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Cryptographic proofs verify integrity</span>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  )
}
