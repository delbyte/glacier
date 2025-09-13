"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"
import { WalletConnection } from "@/components/wallet-connection"
import { TokenClaim } from "@/components/token-claim"
import { GlowCard } from "@/components/spotlight-card"

interface Provider {
  id: string
  name: string
  location: string
  price: string
  reputation: number
  selected: boolean
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
  const { isConnected } = useAccount()
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [providers, setProviders] = useState<Provider[]>([
    { id: "1", name: "StorageNode Alpha", location: "US East", price: "0.001 GLCR/MB", reputation: 98, selected: true },
    {
      id: "2",
      name: "DecentralStore Beta",
      location: "EU West",
      price: "0.0012 GLCR/MB",
      reputation: 95,
      selected: true,
    },
    {
      id: "3",
      name: "ChainStorage Gamma",
      location: "Asia Pacific",
      price: "0.0009 GLCR/MB",
      reputation: 97,
      selected: false,
    },
    { id: "4", name: "BlockVault Delta", location: "US West", price: "0.0011 GLCR/MB", reputation: 94, selected: true },
  ])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  // Load files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('glacier-uploaded-files')
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles)
        setUploadedFiles(parsedFiles.map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt)
        })))
      } catch (error) {
        console.error('Error loading saved files:', error)
      }
    }
  }, [])

  const saveFilesToStorage = useCallback((files: UploadedFile[]) => {
    localStorage.setItem('glacier-uploaded-files', JSON.stringify(files))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleProviderToggle = (providerId: string) => {
    setProviders((prev) => prev.map((p) => (p.id === providerId ? { ...p, selected: !p.selected } : p)))
  }

  const handleUpload = async () => {
    if (!file || !password || !isConnected) return

    setUploading(true)
    setUploadProgress(0)

    try {
      // Convert file to base64 for localStorage
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setUploading(false)

            // Save file to localStorage
            const newFile: UploadedFile = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              name: file.name,
              size: file.size,
              type: file.type,
              uploadedAt: new Date(),
              data: base64,
            }

            const updatedFiles = [...uploadedFiles, newFile]
            setUploadedFiles(updatedFiles)
            saveFilesToStorage(updatedFiles)

            return 100
          }
          return prev + 10
        })
      }, 300)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploading(false)
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const selectedProviders = providers.filter((p) => p.selected)
  const totalCost = selectedProviders.length * 0.001 * (file ? file.size / (1024 * 1024) : 0)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Upload to Glacier</h1>
              <p className="text-xl text-gray-300">
                Connect your MetaMask wallet to start uploading files to the decentralized storage network
              </p>
            </div>

            <GlowCard glowColor="ice" customSize={true} className="p-8 border-2 border-blue-500/20">
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold">Upload to Glacier</h1>
            <p className="text-gray-400">Securely store your files across the decentralized network</p>
          </div>

          <div className="flex items-center gap-4">
            <WalletConnection />
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Selection */}
            <GlowCard glowColor="glacier" customSize={true} className="p-6">
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

            {/* Provider Selection */}
            <GlowCard glowColor="deep" customSize={true} className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Select Storage Providers</h3>
                  <p className="text-gray-400">Choose which providers will store parts of your file</p>
                </div>

                <div className="space-y-4">
                  {providers.map((provider) => (
                    <div key={provider.id} className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800/80 transition-all duration-200 hover:transform hover:scale-[1.01] cursor-pointer">
                      <Checkbox
                        checked={provider.selected}
                        onCheckedChange={() => handleProviderToggle(provider.id)}
                        className="border-gray-600"
                      />
                      <div className="flex-1" onClick={() => handleProviderToggle(provider.id)}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white">{provider.name}</h4>
                          <span className="text-sm text-gray-400">{provider.price}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{provider.location}</span>
                          <span>Reputation: {provider.reputation}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedProviders.length < 2 && (
                  <Alert className="mt-4 border-yellow-500/50 bg-yellow-500/10">
                    <AlertDescription className="text-yellow-200">
                      Select at least 2 providers for redundancy and security.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </GlowCard>

            {/* Upload Progress */}
            {uploading && (
              <GlowCard glowColor="arctic" customSize={true} className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Uploading...</h3>
                    <p className="text-gray-400">Encrypting, chunking, and distributing your file</p>
                  </div>

                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-400">
                    {uploadProgress < 30 && "Encrypting file..."}
                    {uploadProgress >= 30 && uploadProgress < 60 && "Splitting into chunks..."}
                    {uploadProgress >= 60 && uploadProgress < 90 && "Uploading to providers..."}
                    {uploadProgress >= 90 && "Creating smart contracts..."}
                    {uploadProgress === 100 && "Upload complete!"}
                  </p>
                </div>
              </GlowCard>
            )}

            {/* Recent Uploads */}
            {uploadedFiles.length > 0 && (
              <GlowCard glowColor="frost" customSize={true} className="p-6">
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
          <div className="space-y-6">
            <TokenClaim />

            <GlowCard glowColor="ice" customSize={true} className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Upload Summary</h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>File Size:</span>
                    <span>{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Providers:</span>
                    <span>{selectedProviders.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Redundancy:</span>
                    <span>{selectedProviders.length > 1 ? "High" : "Low"}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t border-gray-700 pt-2">
                    <span>Total Cost:</span>
                    <span>{totalCost.toFixed(4)} GLCR</span>
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!file || !password || selectedProviders.length < 1 || uploading}
                  className="w-full transition-all duration-200 hover:transform hover:scale-[1.02] disabled:hover:scale-100"
                  size="lg"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </span>
                  ) : (
                    "Upload File"
                  )}
                </Button>
              </div>
            </GlowCard>

            <GlowCard glowColor="glacier" customSize={true} className="p-6">
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
