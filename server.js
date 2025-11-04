import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Store connected providers and users
const providers = new Map() // socketId -> { username, socketId }
const users = new Map() // socketId -> { username, socketId, isProvider }

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'https://glacier-sigma.vercel.app',
        'https://glacier-production-f766.up.railway.app/'
      ],
      methods: ['GET', 'POST']
    },
    maxHttpBufferSize: 100 * 1024 * 1024 // 100MB for file transfers
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
        selectedProviders
      } = data

      const sender = users.get(socket.id)
      
      console.log(`File upload from ${senderUsername}: ${fileName} (${fileSize} bytes)`)

      // Get all providers except the sender
      const recipientProviders = Array.from(providers.values()).filter(
        provider => provider.socketId !== socket.id
      )

      if (recipientProviders.length === 0) {
        socket.emit('upload-error', { message: 'No providers available' })
        return
      }

      const costPerProvider = cost / recipientProviders.length

      // Send file to each provider
      recipientProviders.forEach(provider => {
        io.to(provider.socketId).emit('file-received', {
          fileData: encryptedData || fileData,
          fileName,
          fileSize,
          fileType,
          senderUsername,
          payment: costPerProvider,
          timestamp: new Date().toISOString()
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

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
