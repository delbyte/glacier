const { createServer } = require('http')
const { Server } = require('socket.io')

const httpServer = createServer()

// Store connected providers and users
const providers = new Map() // socketId -> { username, socketId }
const users = new Map() // socketId -> { username, socketId, isProvider }

const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST'],
    credentials: false
  },
  maxHttpBufferSize: 100 * 1024 * 1024, // 100MB for file transfers
  transports: ['polling', 'websocket'],
  allowUpgrades: true
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Register as provider
  socket.on('register-provider', (data) => {
    const { username } = data
    providers.set(socket.id, { username, socketId: socket.id })
    users.set(socket.id, { username, socketId: socket.id, isProvider: true })
    
    console.log(`Provider registered: ${username} (${socket.id})`)
    
    // Notify all clients about updated provider list
    io.emit('provider-list-update', {
      providers: Array.from(providers.values()).map(p => ({ username: p.username, id: p.socketId }))
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
    socket.emit('provider-list-update', {
      providers: Array.from(providers.values()).map(p => ({ username: p.username, id: p.socketId }))
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
      providers: Array.from(providers.values()).map(p => ({ username: p.username, id: p.socketId }))
    })
  })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`✅ Socket.io server running on port ${PORT}`)
  console.log(`📡 CORS enabled for:`)
  console.log(`   - http://localhost:3000`)
  console.log(`   - https://glacier-sigma.vercel.app`)
})
