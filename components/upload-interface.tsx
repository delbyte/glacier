"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Provider {
  id: string
  name: string
  location: string
  price: string
  reputation: number
  selected: boolean
}

export function UploadInterface() {
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
  const [walletConnected, setWalletConnected] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleProviderToggle = (providerId: string) => {
    setProviders((prev) => prev.map((p) => (p.id === providerId ? { ...p, selected: !p.selected } : p)))
  }

  const connectWallet = async () => {
    // Placeholder for wallet connection
    // In real implementation, this would connect to MetaMask/Core.app
    setWalletConnected(true)
  }

  const handleUpload = async () => {
    if (!file || !password || !walletConnected) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const selectedProviders = providers.filter((p) => p.selected)
  const totalCost = selectedProviders.length * 0.001 * (file ? file.size / (1024 * 1024) : 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 mb-4">
            <span>←</span>
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Upload to Glacier</h1>
          <p className="text-muted-foreground">Securely store your files across the decentralized network</p>
        </div>

        {!walletConnected ? (
          <Button onClick={connectWallet} className="px-6">
            Connect Wallet
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Wallet Connected</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select File</CardTitle>
              <CardDescription>Choose the file you want to store securely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" onChange={handleFileChange} className="mt-1" />
                {file && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="password">Encryption Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This password encrypts your file client-side. Keep it safe - we cannot recover it.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Provider Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Storage Providers</CardTitle>
              <CardDescription>Choose which providers will store parts of your file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox checked={provider.selected} onCheckedChange={() => handleProviderToggle(provider.id)} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{provider.name}</h4>
                        <span className="text-sm text-muted-foreground">{provider.price}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{provider.location}</span>
                        <span>Reputation: {provider.reputation}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedProviders.length < 2 && (
                <Alert className="mt-4">
                  <AlertDescription>Select at least 2 providers for redundancy and security.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {uploading && (
            <Card>
              <CardHeader>
                <CardTitle>Uploading...</CardTitle>
                <CardDescription>Encrypting, chunking, and distributing your file</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {uploadProgress < 30 && "Encrypting file..."}
                  {uploadProgress >= 30 && uploadProgress < 60 && "Splitting into chunks..."}
                  {uploadProgress >= 60 && uploadProgress < 90 && "Uploading to providers..."}
                  {uploadProgress >= 90 && "Creating smart contracts..."}
                  {uploadProgress === 100 && "Upload complete!"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <div className="flex justify-between text-sm font-medium border-t pt-2">
                  <span>Total Cost:</span>
                  <span>{totalCost.toFixed(4)} GLCR</span>
                </div>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!file || !password || !walletConnected || selectedProviders.length < 1 || uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Upload File"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How it Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span>File encrypted with your password</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Split into chunks across providers</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Smart contracts ensure storage</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Cryptographic proofs verify integrity</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
