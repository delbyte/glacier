"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Upload, HardDrive, Wallet } from "lucide-react"
import Link from "next/link"
import { GlowCard } from "@/components/spotlight-card"
import { getUserProfile, initializeUser, updateUserProfile } from "@/lib/user-manager"
import { useSocket } from "@/hooks/useSocket"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const { address, isConnected: walletConnected } = useAccount()
  const [username, setUsername] = useState("")
  const [registering, setRegistering] = useState(false)
  const [userType, setUserType] = useState<'user' | 'provider'>('user')
  const [mounted, setMounted] = useState(false)
  const { registerAsUser, registerAsProvider } = useSocket()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Check if already registered
    const profile = getUserProfile()
    if (profile) {
      // Already registered, redirect based on type
      if (profile.isProvider) {
        router.push('/provider-dashboard')
      } else {
        router.push('/upload')
      }
    }
  }, [router])

  const handleRegister = async () => {
    if (!walletConnected) {
      alert('⚠️ Please connect your wallet first to use Glacier.')
      return
    }

    if (!username || username.trim().length < 3) {
      alert('Please enter a username (at least 3 characters)')
      return
    }

    setRegistering(true)

    try {
      const isProvider = userType === 'provider'
      
      // Initialize user profile with wallet address
      initializeUser(username, isProvider)
      if (address) {
        updateUserProfile({ walletAddress: address })
      }

      // Register with socket server
      if (isProvider) {
        registerAsProvider(username, address)
        
        // Request notification permission for providers
        if ('Notification' in window && Notification.permission === 'default') {
          await Notification.requestPermission()
        }
      } else {
        registerAsUser(username)
      }

      // Simulate registration animation
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Redirect based on type
      if (isProvider) {
        router.push('/provider-dashboard')
      } else {
        router.push('/upload')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
      setRegistering(false)
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <Link href="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-2 sm:mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm sm:text-base">Back to Home</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome to Glacier</h1>
            <p className="text-gray-400 text-sm sm:text-base">Get started by creating your account</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Registration Card */}
          <GlowCard glowColor="glacier" customSize={true} className="p-6 sm:p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <User className="w-12 h-12 mx-auto text-blue-400" />
                <h2 className="text-2xl font-bold">Create Your Account</h2>
                <p className="text-gray-400">
                  Choose your role and get started with 1000 free GLCR tokens
                </p>
              </div>

              {/* Username Input */}
              <div>
                <Label htmlFor="username">Choose a Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                  disabled={registering}
                />
                <p className="text-xs text-gray-400 mt-1">
                  At least 3 characters. This will be visible to other users.
                </p>
              </div>

              {/* User Type Selection */}
              <div className="space-y-3">
                <Label>I want to:</Label>
                
                <div
                  onClick={() => setUserType('user')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.02] ${
                    userType === 'user'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Upload className="w-6 h-6 text-blue-400" />
                    <div>
                      <h4 className="font-medium text-white">Upload Files</h4>
                      <p className="text-sm text-gray-400">Store your files securely on the network</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setUserType('provider')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.02] ${
                    userType === 'provider'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-6 h-6 text-green-400" />
                    <div>
                      <h4 className="font-medium text-white">Provide Storage</h4>
                      <p className="text-sm text-gray-400">Earn GLCR by storing files for others</p>
                    </div>
                  </div>
                </div>
              </div>

              {userType === 'provider' && (
                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <AlertDescription className="text-blue-200 text-sm">
                    As a provider, you'll automatically receive files when users upload to the network. Keep your browser open to earn AVAX!
                  </AlertDescription>
                </Alert>
              )}

              {!walletConnected && (
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertDescription className="text-yellow-200 text-sm flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span>Connect your wallet to register (top right corner)</span>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleRegister}
                disabled={!walletConnected || !username || username.trim().length < 3 || registering}
                className="w-full transition-all duration-200 hover:transform hover:scale-[1.02] disabled:hover:scale-100"
                size="lg"
              >
                {registering ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Setting up your account...
                  </span>
                ) : !walletConnected ? (
                  <span className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Connect Wallet First
                  </span>
                ) : (
                  `Create Account & Start ${userType === 'provider' ? 'Earning' : 'Uploading'}`
                )}
              </Button>
            </div>
          </GlowCard>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlowCard glowColor="deep" customSize={true} className="p-4">
              <h4 className="font-bold mb-2">Free to Start</h4>
              <p className="text-sm text-gray-400">
                Get 1000 GLCR tokens instantly to upload files or start providing storage
              </p>
            </GlowCard>

            <GlowCard glowColor="arctic" customSize={true} className="p-4">
              <h4 className="font-bold mb-2">Proof of Concept</h4>
              <p className="text-sm text-gray-400">
                This demo uses localStorage. In production, all data will be stored on-chain
              </p>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  )
}
