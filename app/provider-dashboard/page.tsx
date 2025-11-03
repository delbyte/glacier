"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/spotlight-card"
import { ArrowLeft, FileText, Download, Wifi, WifiOff, DollarSign } from "lucide-react"
import Link from "next/link"
import { getUserProfile, getReceivedFiles, getBalance, formatBalance, formatFileSize, type ReceivedFile } from "@/lib/user-manager"
import { useSocket } from "@/hooks/useSocket"

export default function ProviderDashboard() {
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([])
  const [balance, setBalance] = useState(0)
  const [username, setUsername] = useState<string>("")
  const { isConnected } = useSocket()

  useEffect(() => {
    // Load user profile
    const profile = getUserProfile()
    if (profile) {
      setUsername(profile.username)
      setBalance(profile.balance)
    }

    // Load received files
    loadReceivedFiles()

    // Refresh balance and files periodically
    const interval = setInterval(() => {
      setBalance(getBalance())
      loadReceivedFiles()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const loadReceivedFiles = () => {
    const files = getReceivedFiles()
    setReceivedFiles(files)
  }

  const totalStorage = receivedFiles.reduce((sum, file) => sum + file.fileSize, 0)
  const totalEarned = receivedFiles.reduce((sum, file) => sum + file.payment, 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <Link href="/provider" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-2 sm:mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm sm:text-base">Back to Provider Settings</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Provider Dashboard</h1>
            <p className="text-gray-400 text-sm sm:text-base">Monitor your storage operations and earnings</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Offline</span>
                </>
              )}
            </div>
            <Link href="/upload">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Upload Files
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6 order-2 xl:order-1">
            {/* Balance Card */}
            <GlowCard glowColor="glacier" customSize={true} className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="text-sm font-bold">GLCR Balance</h3>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {formatBalance(balance)}
                </div>
                <p className="text-xs text-gray-400">
                  Earn GLCR by storing files for the network
                </p>
              </div>
            </GlowCard>

            {/* Stats Card */}
            <GlowCard glowColor="deep" customSize={true} className="p-4 sm:p-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold">Storage Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Files Stored:</span>
                    <span className="font-medium">{receivedFiles.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Size:</span>
                    <span className="font-medium">{formatFileSize(totalStorage)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-700 pt-2">
                    <span>Total Earned:</span>
                    <span className="font-medium text-green-400">{totalEarned.toFixed(4)} GLCR</span>
                  </div>
                </div>
              </div>
            </GlowCard>

            {/* Info Card */}
            <GlowCard glowColor="arctic" customSize={true} className="p-4 sm:p-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold">Provider Info</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>
                    <span className="text-gray-500">Username:</span>
                    <p className="text-white font-medium">{username || "Not registered"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="text-white font-medium">
                      {isConnected ? "Active & Receiving" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <GlowCard glowColor="ice" customSize={true} className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Received Files ({receivedFiles.length})</h3>
                  <p className="text-sm text-gray-400">
                    {receivedFiles.length === 0
                      ? "No files received yet. Keep your browser open to start receiving files."
                      : `Files automatically downloaded to your device`
                    }
                  </p>
                </div>

                {receivedFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg font-medium mb-2">Waiting for files...</h3>
                    <p className="text-gray-400 mb-2">Files will automatically download when users upload to the network</p>
                    <p className="text-sm text-gray-500">Keep your browser open to receive files</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {receivedFiles.map((file) => (
                      <div key={file.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm sm:text-base truncate">{file.fileName}</h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-400">
                              <span>From: <span className="text-blue-400">{file.senderUsername}</span></span>
                              <span className="hidden sm:inline">•</span>
                              <span>{formatFileSize(file.fileSize)}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-green-400">+{file.payment.toFixed(4)} GLCR</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(file.receivedAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                          <div className="px-3 py-1 bg-green-900/30 border border-green-700 rounded text-xs text-green-400">
                            Auto-downloaded
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  )
}
