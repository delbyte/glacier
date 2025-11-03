"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Wifi, WifiOff, CheckCircle } from "lucide-react"
import Link from "next/link"
import { GlowCard } from "@/components/spotlight-card"
import { getUserProfile, initializeUser, setProviderStatus } from "@/lib/user-manager"
import { useSocket } from "@/hooks/useSocket"

export function ProviderInterface() {
  const [username, setUsername] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [downloadPermission, setDownloadPermission] = useState<string>("default")
  const [mounted, setMounted] = useState(false)
  const { isConnected, registerAsProvider } = useSocket()

  useEffect(() => {
    setMounted(true)
    // Check if user is already registered as provider
    const profile = getUserProfile()
    if (profile && profile.isProvider) {
      setIsRegistered(true)
      setUsername(profile.username)
    }

    // Check download permission status
    if ('permissions' in navigator) {
      // @ts-ignore - download permission API is experimental
      navigator.permissions.query({ name: 'downloads' }).then((result) => {
        setDownloadPermission(result.state)
      }).catch(() => {
        // Permission API not supported
        setDownloadPermission("granted")
      })
    } else {
      setDownloadPermission("granted")
    }
  }, [])

  const requestDownloadPermission = async () => {
    // Modern browsers automatically handle downloads
    // Just show a notification request
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        new Notification('Glacier Provider', {
          body: 'You will receive notifications when files are sent to you',
          icon: '/favicon.ico'
        })
      }
    }
    setDownloadPermission("granted")
  }

  const handleRegister = async () => {
    if (!username || username.trim().length < 3) {
      alert('Please enter a username (at least 3 characters)')
      return
    }

    setRegistering(true)

    try {
      // Request download/notification permission
      await requestDownloadPermission()

      // Initialize or update user profile
      const profile = getUserProfile()
      if (profile) {
        setProviderStatus(true)
      } else {
        initializeUser(username, true)
      }

      // Register with socket server
      registerAsProvider(username)

      setIsRegistered(true)
      
      // Simulate registration animation
      setTimeout(() => {
        setRegistering(false)
      }, 1500)
    } catch (error) {
      console.error('Registration error:', error)
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Become a Storage Provider</h1>
            <p className="text-gray-400 text-sm sm:text-base">Earn passive income by providing storage to the network</p>
          </div>

          <div className="flex flex-col items-stretch sm:items-end gap-3">
            {isRegistered && (
              <Link href="/provider-dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  Provider Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Registration Form */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6 order-1">
            {!isRegistered ? (
              <GlowCard glowColor="glacier" customSize={true} className="p-6 sm:p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Become a Storage Provider</h3>
                    <p className="text-gray-400">Earn GLCR by storing files for the network</p>
                  </div>

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
                      This username will be shown to file senders
                    </p>
                  </div>

                  <Alert className="border-blue-500/50 bg-blue-500/10">
                    <AlertDescription className="text-blue-200 text-sm">
                      <strong>How it works:</strong> Keep your browser open and you'll automatically receive files when users upload to the network. Files will download to your computer and you'll earn GLCR for each file stored.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleRegister}
                    disabled={!username || username.trim().length < 3 || registering}
                    className="w-full transition-all duration-200 hover:transform hover:scale-[1.02] disabled:hover:scale-100"
                    size="lg"
                  >
                    {registering ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Setting up...
                      </span>
                    ) : (
                      "Start Providing Storage"
                    )}
                  </Button>
                </div>
              </GlowCard>
            ) : (
              <GlowCard glowColor="glacier" customSize={true} className="p-6 sm:p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <div>
                      <h3 className="text-xl font-bold">Provider Active</h3>
                      <p className="text-gray-400">You're now receiving files from the network</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Username:</span>
                      <span className="text-white font-medium">{username}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Status:</span>
                      <div className="flex items-center gap-2">
                        {isConnected ? (
                          <>
                            <Wifi className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium">Online & Receiving</span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 font-medium">Offline</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Alert className="border-green-500/50 bg-green-500/10">
                    <AlertDescription className="text-green-200 text-sm">
                      Keep this browser tab open to continue receiving files and earning GLCR!
                    </AlertDescription>
                  </Alert>

                  <Link href="/provider-dashboard">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      View Provider Dashboard
                    </Button>
                  </Link>
                </div>
              </GlowCard>
            )}

            <GlowCard glowColor="deep" customSize={true} className="p-6 sm:p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">How It Works</h3>
                  <p className="text-gray-400">Simple storage providing in 3 steps</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/30 transition-all duration-200">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Register as Provider</h4>
                      <p className="text-sm text-gray-400">
                        Choose a username and register. We'll request permission to download files automatically.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/30 transition-all duration-200">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Keep Browser Open</h4>
                      <p className="text-sm text-gray-400">
                        Stay online and you'll automatically receive files when users upload to the network. Files are encrypted and will download to your computer.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/30 transition-all duration-200">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Earn GLCR Automatically</h4>
                      <p className="text-sm text-gray-400">
                        Get paid instantly in GLCR tokens for every file you store. Track your earnings in the provider dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-2">
            <GlowCard glowColor="ice" customSize={true} className="p-6 sm:p-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Earnings Potential</h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Rate:</span>
                    <span>0.001 GLCR/MB/month</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>High Reputation Bonus:</span>
                    <span>+20%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Uptime Bonus:</span>
                    <span>+15%</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t border-gray-700 pt-2">
                    <span>Est. Monthly (1TB):</span>
                    <span>~1,380 GLCR</span>
                  </div>
                </div>
              </div>
            </GlowCard>

            <GlowCard glowColor="arctic" customSize={true} className="p-6 sm:p-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Requirements</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Reliable internet connection</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Available storage space</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>GLCR tokens for staking</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>24/7 uptime preferred</span>
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
