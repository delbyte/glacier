"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowCard } from "@/components/spotlight-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, FileText, Download, Trash2, Search, Filter } from "lucide-react"
import Link from "next/link"
import { WalletConnection } from "@/components/wallet-connection"
import { TokenClaim } from "@/components/token-claim"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  data: string
}

export default function Dashboard() {
  const { isConnected } = useAccount()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Load files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('glacier-uploaded-files')
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles)
        setFiles(parsedFiles.map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt)
        })))
      } catch (error) {
        console.error('Error loading saved files:', error)
      }
    }
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image'
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext || '')) return 'document'
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext || '')) return 'video'
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext || '')) return 'audio'
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) return 'archive'
    return 'other'
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || getFileType(file.name) === filterType
    return matchesSearch && matchesFilter
  })

  const totalStorage = files.reduce((sum, file) => sum + file.size, 0)
  const fileTypes = [...new Set(files.map(file => getFileType(file.name)))]

  const downloadFile = (file: UploadedFile) => {
    const link = document.createElement('a')
    link.href = file.data
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const deleteFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId)
    setFiles(updatedFiles)
    localStorage.setItem('glacier-uploaded-files', JSON.stringify(updatedFiles))
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Dashboard</h1>
              <p className="text-lg sm:text-xl text-gray-300">
                Connect your Core wallet to view your uploaded files
              </p>
            </div>

            <GlowCard glowColor="ice" customSize={true} className="p-4 sm:p-6 border-2 border-blue-500/20">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold">Wallet Connection Required</h3>
                  <p className="text-sm sm:text-base text-gray-300">
                    Connect your Core wallet to access your dashboard and manage files
                  </p>
                </div>
                <div className="flex justify-center">
                  <WalletConnection />
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <Link href="/provider/upload" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-2 sm:mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm sm:text-base">Back to Upload</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your uploaded files and storage</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="order-2 sm:order-1">
              <WalletConnection />
            </div>
            <Link href="/provider/upload" className="order-1 sm:order-2">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Upload New File
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6 order-2 xl:order-1">
            <TokenClaim />

            {/* Storage Stats */}
            <GlowCard glowColor="glacier" customSize={true} className="p-4 sm:p-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold">Storage Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Files:</span>
                    <span>{files.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Size:</span>
                    <span>{formatFileSize(totalStorage)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>File Types:</span>
                    <span>{fileTypes.length}</span>
                  </div>
                </div>
              </div>
            </GlowCard>

            {/* Filters */}
            <GlowCard glowColor="deep" customSize={true} className="p-4 sm:p-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                <div>
                  <Label htmlFor="search" className="text-xs">Search Files</Label>
                  <div className="relative mt-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name..."
                      className="pl-10 bg-gray-800 border-gray-600 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">File Type</Label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="image">Images</option>
                    <option value="document">Documents</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                    <option value="archive">Archives</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <GlowCard glowColor="arctic" customSize={true} className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Your Files ({filteredFiles.length})</h3>
                  <p className="text-sm text-gray-400">
                    {files.length === 0
                      ? "No files uploaded yet. Start by uploading your first file."
                      : `Showing ${filteredFiles.length} of ${files.length} files`
                    }
                  </p>
                </div>
                {files.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg font-medium mb-2">No files yet</h3>
                    <p className="text-gray-400 mb-6">Upload your first file to get started</p>
                    <Link href="/provider/upload">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Upload File
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredFiles.map((file) => (
                      <div key={file.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm sm:text-base truncate">{file.name}</h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-400">
                              <span>{formatFileSize(file.size)}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{formatDate(file.uploadedAt)}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="capitalize">{getFileType(file.name)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(file)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs sm:text-sm"
                          >
                            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="ml-1 sm:hidden">Download</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteFile(file.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600/10 text-xs sm:text-sm"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="ml-1 sm:hidden">Delete</span>
                          </Button>
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