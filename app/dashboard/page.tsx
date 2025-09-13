"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
              <p className="text-xl text-gray-300">
                Connect your MetaMask wallet to view your uploaded files
              </p>
            </div>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center">Wallet Connection Required</CardTitle>
                <CardDescription className="text-center">
                  Connect your wallet to access your dashboard and manage files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <WalletConnection />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/provider/upload" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Upload</span>
            </Link>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Manage your uploaded files and storage</p>
          </div>

          <div className="flex items-center gap-4">
            <WalletConnection />
            <Link href="/provider/upload">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Upload New File
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <TokenClaim />

            {/* Storage Stats */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">Storage Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Your Files ({filteredFiles.length})</CardTitle>
                <CardDescription>
                  {files.length === 0
                    ? "No files uploaded yet. Start by uploading your first file."
                    : `Showing ${filteredFiles.length} of ${files.length} files`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                  <div className="space-y-4">
                    {filteredFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{file.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{formatDate(file.uploadedAt)}</span>
                              <span className="capitalize">{getFileType(file.name)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(file)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteFile(file.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}