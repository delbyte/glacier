"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { GlowCard } from "@/components/spotlight-card"

export function ProviderInterface() {
  const [nodeUrl, setNodeUrl] = useState("")
  const [stakeAmount, setStakeAmount] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [registering, setRegistering] = useState(false)

  const connectWallet = async () => {
    // Placeholder for wallet connection
    setWalletConnected(true)
  }

  const handleRegister = async () => {
    if (!nodeUrl || !stakeAmount || !walletConnected) return

    setRegistering(true)
    // Simulate registration process
    setTimeout(() => {
      setRegistering(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-white">Become a Storage Provider</h1>
            <p className="text-gray-400">Earn passive income by providing storage to the network</p>
          </div>

          {!walletConnected ? (
            <Button onClick={connectWallet} size="lg">
              Connect Wallet
            </Button>
          ) : (
            <div className="text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Wallet Connected</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2 space-y-6">
            <GlowCard glowColor="glacier" customSize={true} className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Provider Registration</h3>
                  <p className="text-gray-400">Set up your storage node to start earning</p>
                </div>

                <div>
                  <Label htmlFor="nodeUrl">Node URL</Label>
                  <Input
                    id="nodeUrl"
                    value={nodeUrl}
                    onChange={(e) => setNodeUrl(e.target.value)}
                    placeholder="http://your-ip:3000"
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    The public URL where your provider node is accessible
                  </p>
                </div>

                <div>
                  <Label htmlFor="stake">Stake Amount (GLCR)</Label>
                  <Input
                    id="stake"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="1000"
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Collateral staked to guarantee service quality. Higher stakes earn more trust.
                  </p>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={!nodeUrl || !stakeAmount || !walletConnected || registering}
                  className="w-full transition-all duration-200 hover:transform hover:scale-[1.02] disabled:hover:scale-100"
                  size="lg"
                >
                  {registering ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Registering...
                    </span>
                  ) : (
                    "Register as Provider"
                  )}
                </Button>
              </div>
            </GlowCard>

            <GlowCard glowColor="deep" customSize={true} className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Setup Instructions</h3>
                  <p className="text-gray-400">Follow these steps to set up your provider node</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/30 transition-all duration-200">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Download Provider Node</h4>
                      <p className="text-sm text-gray-400">
                        Download and install the Glacier provider node software on your server.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 transition-all duration-200 hover:transform hover:scale-[1.02]">
                        Download Node Software
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/30 transition-all duration-200">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Configure Environment</h4>
                      <p className="text-sm text-gray-400">
                        Set up your .env file with PRIVATE_KEY and FUJI_RPC_URL for Avalanche connection.
                      </p>
                      <div className="mt-2 p-3 bg-gray-800 rounded-lg text-xs font-mono text-gray-300 hover:bg-gray-700 transition-colors duration-200">
                        PRIVATE_KEY=your_wallet_private_key
                        <br />
                        FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/30 transition-all duration-200">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Start Node & Register</h4>
                      <p className="text-sm text-gray-400">
                        Run your node and register it using the form above. Your node will start accepting storage
                        requests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <GlowCard glowColor="ice" customSize={true} className="p-6">
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

            <GlowCard glowColor="arctic" customSize={true} className="p-6">
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

            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertDescription className="text-yellow-200 text-xs">
                <strong>Note:</strong> This is a hackathon MVP. Full provider economics and challenge mechanisms are still
                in development.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
