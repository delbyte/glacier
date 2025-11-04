const { createServer } = require('http')
const { Server } = require('socket.io')

const httpServer = createServer((req, res) => {
  // Add CORS headers to all HTTP requests
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Credentials', 'false')
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  
  res.writeHead(200)
  res.end('Socket.io server running')
})

// Store connected providers and users
const providers = new Map() // socketId -> { username, socketId }
const users = new Map() // socketId -> { username, socketId, isProvider }

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: false
  },
  maxHttpBufferSize: 100 * 1024 * 1024, // 100MB for file transfers
  transports: ['polling', 'websocket'],
  allowUpgrades: true,
  pingTimeout: 60000,
  pingInterval: 25000
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Register as provider
  socket.on('register-provider', (data) => {
    const { username, walletAddress } = data
    
    console.log(`📝 Provider registration attempt:`)
    console.log(`  - Username: ${username}`)
    console.log(`  - Socket ID: ${socket.id}`)
    console.log(`  - Wallet Address: ${walletAddress || 'NOT PROVIDED'}`)
    
    // Store provider with wallet address if available
    const providerData = { 
      username, 
      socketId: socket.id, 
      walletAddress: walletAddress || null 
    }
    
    providers.set(socket.id, providerData)
    users.set(socket.id, { 
      username, 
      socketId: socket.id, 
      isProvider: true, 
      walletAddress: walletAddress || null 
    })
    
    console.log(`✅ Provider registered: ${username} (${socket.id})`)
    if (walletAddress) {
      console.log(`   💳 With wallet: ${walletAddress}`)
    } else {
      console.log(`   ⚠️  No wallet address provided - payments will be skipped!`)
    }
    
    // Notify all clients about updated provider list
    // Use walletAddress as ID if available, otherwise use socket ID
    const providerList = Array.from(providers.values()).map(p => ({ 
      username: p.username, 
      id: p.walletAddress || p.socketId,
      socketId: p.socketId,
      hasWallet: !!p.walletAddress
    }))
    
    console.log(`📤 Broadcasting provider list (count: ${providerList.length}):`)
    providerList.forEach(p => {
      console.log(`   - ${p.username}: ${p.hasWallet ? `wallet ${p.id}` : `socketId ${p.id} (no wallet)`}`)
    })
    
    io.emit('provider-list-update', {
      providers: providerList
    })
  })

  // Register as user
  socket.on('register-user', (data) => {
    const { username } = data
    users.set(socket.id, { username, socketId: socket.id, isProvider: false })
    
    console.log(`User registered: ${username} (${socket.id})`)
  })

  // Send file to all providers (except sender if they're also a provider)
  socket.on('send-file', (data) => {
    const { 
      fileData, 
      fileName, 
      fileSize, 
      fileType, 
      senderUsername,
      encryptedData,
      cost,
      selectedProviders,
      originalFileName
    } = data

    const sender = users.get(socket.id)
    
    console.log(`File upload from ${senderUsername}: ${originalFileName || fileName} (${fileSize} bytes)`)

    // Get all providers except the sender
    const recipientProviders = Array.from(providers.values()).filter(
      provider => provider.socketId !== socket.id
    )

    if (recipientProviders.length === 0) {
      socket.emit('upload-error', { message: 'No providers available' })
      return
    }

    const costPerProvider = cost / recipientProviders.length

    // Get file extension
    const fileExtension = (originalFileName || fileName).split('.').pop() || 'bin'

    // Send file to each provider with their socket ID as filename
    recipientProviders.forEach(provider => {
      // Use provider's socket ID as the filename for anonymity/security
      const encryptedFileName = `${provider.socketId}.${fileExtension}`
      
      io.to(provider.socketId).emit('file-received', {
        fileData: encryptedData || fileData,
        fileName: encryptedFileName,
        fileSize,
        fileType,
        senderUsername,
        payment: costPerProvider,
        timestamp: new Date().toISOString(),
        originalFileName: originalFileName || fileName
      })
    })

    // Notify sender of successful upload
    socket.emit('upload-success', {
      recipientCount: recipientProviders.length,
      recipients: recipientProviders.map(p => p.username)
    })

    console.log(`File distributed to ${recipientProviders.length} providers`)
  })

  // Handle payment notifications
  socket.on('payment-sent', (data) => {
    const { recipientSocketId, amount } = data
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('payment-received', { amount })
    }
  })

  // Get current provider list
  socket.on('get-providers', () => {
    const providerList = Array.from(providers.values()).map(p => ({ 
      username: p.username, 
      id: p.walletAddress || p.socketId,
      socketId: p.socketId,
      hasWallet: !!p.walletAddress
    }))
    
    console.log(`📋 Client ${socket.id} requested provider list (count: ${providerList.length})`)
    
    socket.emit('provider-list-update', {
      providers: providerList
    })
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id)
    
    if (user) {
      console.log(`${user.isProvider ? 'Provider' : 'User'} disconnected: ${user.username} (${socket.id})`)
    }

    providers.delete(socket.id)
    users.delete(socket.id)

    // Notify all clients about updated provider list
    io.emit('provider-list-update', {
      providers: Array.from(providers.values()).map(p => ({ 
        username: p.username, 
        id: p.walletAddress || p.socketId,
        socketId: p.socketId,
        hasWallet: !!p.walletAddress
      }))
    })
  })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`✅ Socket.io server running on port ${PORT}`)

})
