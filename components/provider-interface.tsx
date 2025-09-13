"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Become a Storage Provider</h1>
          <p className="text-muted-foreground">Earn passive income by providing storage to the network</p>
        </div>

        {!walletConnected ? (
          <Button onClick={connectWallet} className="px-6">
            Connect Wallet
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">
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
          <Card>
            <CardHeader>
              <CardTitle>Provider Registration</CardTitle>
              <CardDescription>Set up your storage node to start earning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nodeUrl">Node URL</Label>
                <Input
                  id="nodeUrl"
                  value={nodeUrl}
                  onChange={(e) => setNodeUrl(e.target.value)}
                  placeholder="http://your-ip:3000"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
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
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Collateral staked to guarantee service quality. Higher stakes earn more trust.
                </p>
              </div>

              <Button
                onClick={handleRegister}
                disabled={!nodeUrl || !stakeAmount || !walletConnected || registering}
                className="w-full"
              >
                {registering ? "Registering..." : "Register as Provider"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>Follow these steps to set up your provider node</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Download Provider Node</h4>
                    <p className="text-sm text-muted-foreground">
                      Download and install the Glacier provider node software on your server.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Download Node Software
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Configure Environment</h4>
                    <p className="text-sm text-muted-foreground">
                      Set up your .env file with PRIVATE_KEY and FUJI_RPC_URL for Avalanche connection.
                    </p>
                    <div className="mt-2 p-3 bg-muted rounded-lg text-xs font-mono">
                      PRIVATE_KEY=your_wallet_private_key
                      <br />
                      FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Start Node & Register</h4>
                    <p className="text-sm text-muted-foreground">
                      Run your node and register it using the form above. Your node will start accepting storage
                      requests.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Potential</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <div className="flex justify-between text-sm font-medium border-t pt-2">
                  <span>Est. Monthly (1TB):</span>
                  <span>~1,380 GLCR</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
            </CardContent>
          </Card>

          <Alert>
            <AlertDescription className="text-xs">
              <strong>Note:</strong> This is a hackathon MVP. Full provider economics and challenge mechanisms are still
              in development.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
