"use client"

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { getUserProfile, addBalance, saveReceivedFile, type ReceivedFile } from '@/lib/user-manager'

interface Provider {
  username: string
  id: string
}

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [providers, setProviders] = useState<Provider[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://glacier-production-f766.up.railway.app'
        : 'http://localhost:3001')

    console.log('🔌 Connecting to socket server:', socketUrl)

    const newSocket = io(socketUrl, {
      transports: ['polling', 'websocket'], // Try polling first
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)

      // Auto-register user if profile exists
      const profile = getUserProfile()
      if (profile) {
        if (profile.isProvider) {
          newSocket.emit('register-provider', { username: profile.username })
        } else {
          newSocket.emit('register-user', { username: profile.username })
        }
        
        // Request current provider list
        newSocket.emit('get-providers')
      }
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    // Provider list updates
    newSocket.on('provider-list-update', (data: { providers: Provider[] }) => {
      console.log('Provider list updated:', data.providers)
      setProviders(data.providers)
    })

    // File received (for providers)
    newSocket.on('file-received', async (data: {
      fileData: string
      fileName: string
      fileSize: number
      fileType: string
      senderUsername: string
      payment: number
      timestamp: string
      originalFileName?: string
    }) => {
      console.log('File received:', data.fileName, 'from', data.senderUsername)

      // Add payment to balance
      try {
        addBalance(data.payment)
      } catch (error) {
        console.error('Error adding balance:', error)
      }

      // Save to received files list (metadata only, not file data)
      const receivedFile: ReceivedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        fileName: data.originalFileName || data.fileName, // Show original filename in dashboard
        fileSize: data.fileSize,
        fileType: data.fileType,
        senderUsername: data.senderUsername,
        receivedAt: data.timestamp,
        payment: data.payment,
        // fileData not stored to avoid localStorage quota
      }
      saveReceivedFile(receivedFile)

      // Trigger automatic download
      try {
        const link = document.createElement('a')
        link.href = data.fileData
        link.download = data.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        console.log('File downloaded:', data.fileName)
      } catch (error) {
        console.error('Error downloading file:', error)
      }

      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('File Received', {
          body: `${data.fileName} from ${data.senderUsername} (+${data.payment.toFixed(4)} GLCR)`,
          icon: '/favicon.ico'
        })
      }
    })

    // Upload success
    newSocket.on('upload-success', (data: { recipientCount: number, recipients: string[] }) => {
      console.log('✅ Upload successful! Sent to', data.recipientCount, 'providers:', data.recipients)
      alert(`✅ File sent to ${data.recipientCount} provider(s)!`)
    })

    // Upload error
    newSocket.on('upload-error', (data: { message: string }) => {
      console.error('❌ Upload error:', data.message)
      alert(`❌ Upload failed: ${data.message}`)
    })

    // Payment received notification
    newSocket.on('payment-received', (data: { amount: number }) => {
      console.log('Payment received:', data.amount, 'GLCR')
    })

    // Cleanup on unmount
    return () => {
      newSocket.close()
    }
  }, [])

  // Register as provider
  const registerAsProvider = (username: string, walletAddress?: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('register-provider', { username, walletAddress })
    }
  }

  // Register as user
  const registerAsUser = (username: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('register-user', { username })
    }
  }

  // Send file to providers
  const sendFile = (data: {
    fileData: string
    fileName: string
    fileSize: number
    fileType: string
    senderUsername: string
    encryptedData?: string
    cost: number
    selectedProviders?: string[]
    originalFileName?: string
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send-file', data)
    }
  }

  // Request provider list
  const refreshProviders = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('get-providers')
    }
  }

  return {
    socket,
    isConnected,
    providers,
    registerAsProvider,
    registerAsUser,
    sendFile,
    refreshProviders,
  }
}
