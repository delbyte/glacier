# Glacier Real-Time Storage Demo

This is a proof-of-concept demonstrating real-time peer-to-peer file distribution using WebSockets. In production, all data would be stored on-chain.

## Features Implemented

✅ **Real-time WebSocket Communication**
- Providers and users connect via Socket.io
- Automatic peer discovery
- Live provider status updates

✅ **Provider System**
- Simple registration with username
- Automatic file downloads when users upload
- Real-time balance updates
- Provider dashboard showing received files and earnings

✅ **Upload System**
- File size-based cost calculation
- Three network tiers (Basic, Premium, Enterprise)
- Real-time balance checking
- Automatic distribution to all online providers

✅ **GLCR Token System**
- LocalStorage-based balance (1000 GLCR starting balance)
- Automatic payment distribution to providers
- Cost preview before upload

✅ **Self-Exclusion Logic**
- Providers don't receive their own uploaded files
- Files only go to OTHER providers

## Testing Instructions

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the server:
   ```bash
   pnpm dev
   ```

### Test Scenario: Two Browser Windows

#### Window 1 - Provider

1. Open `http://localhost:3000`
2. Click "Become a Provider"
3. Enter username (e.g., "Provider1")
4. Click "Start Providing Storage"
5. Allow notifications when prompted
6. Navigate to "Provider Dashboard" or keep the provider page open
7. Keep this browser window/tab open!

#### Window 2 - User/Sender

1. Open `http://localhost:3000` in a NEW browser window (or incognito mode)
2. Click "Start Storing Files"
3. Enter username (e.g., "User1")
4. Select "Upload Files" option
5. Click "Create Account"
6. You should see "1 Online Provider" if Window 1 is still open
7. Select a file
8. Enter an encryption password
9. Choose a network tier (Basic/Premium/Enterprise)
10. You'll see the cost estimate
11. Click "Upload File"

#### Expected Results

✅ Window 2 (User):
- File upload progress bar completes
- Balance decreases by upload cost
- Success message appears
- "Upload Complete! Sent to 1 provider"

✅ Window 1 (Provider):
- File automatically downloads to your computer
- Balance increases (payment received)
- Provider dashboard updates with new file entry showing:
  - File name
  - Sender username ("User1")
  - File size
  - Payment received (+X GLCR)
  - Timestamp

### Test Scenario: Provider Sending Files

1. Use Window 1 (Provider) to upload a file
2. The file should go to OTHER providers only, not to yourself
3. Provider dashboard won't show their own upload

### Test Scenario: Multiple Providers

1. Open Window 1 as Provider1
2. Open Window 2 as Provider2  
3. Open Window 3 as User
4. Upload file from Window 3
5. Both Provider1 and Provider2 should receive the file
6. Payment is split between both providers

## Architecture

### Frontend Components

- **`server.js`** - Custom Next.js server with Socket.io integration
- **`lib/user-manager.ts`** - LocalStorage user profile and balance management
- **`hooks/useSocket.ts`** - React hook for Socket.io connection management
- **`components/provider-interface.tsx`** - Provider registration UI
- **`components/upload-interface.tsx`** - File upload UI with cost calculation
- **`app/provider-dashboard/page.tsx`** - Provider dashboard showing received files
- **`app/register/page.tsx`** - User/Provider registration page

### Socket Events

- `register-provider` - Register as storage provider
- `register-user` - Register as file uploader
- `send-file` - Broadcast file to all providers (excludes sender)
- `file-received` - Provider receives file and payment notification
- `provider-list-update` - Real-time provider availability updates
- `upload-success` - Confirms file distributed successfully
- `upload-error` - Upload failure notification

### Data Flow

1. **Provider Registration:**
   ```
   Browser → Socket.io → Server registers provider → Broadcasts to all clients
   ```

2. **File Upload:**
   ```
   User selects file → Calculates cost → Deducts balance →
   Converts to base64 → Sends via Socket.io →
   Server filters out sender → Distributes to all providers →
   Providers auto-download → Balances update
   ```

3. **Payment Distribution:**
   ```
   Total cost ÷ Number of providers = Per-provider payment →
   Sender balance -= Total cost →
   Each provider balance += Per-provider payment
   ```

## LocalStorage Keys

- `glacier-user-profile` - User profile with username, isProvider, balance
- `glacier-received-files` - Provider's received files list
- `glacier-uploaded-files` - User's upload history

## Known Limitations (Demo Only)

⚠️ **LocalStorage-based** - Data resets if localStorage is cleared
⚠️ **No persistence** - Providers must keep browser open to receive files
⚠️ **No encryption** - Password field exists but encryption is placeholder
⚠️ **Single-server** - One Socket.io server instance (works for localhost testing)

## Production Requirements

For production deployment:

1. Replace LocalStorage with on-chain storage (Avalanche smart contracts)
2. Implement proper file encryption using Web Crypto API
3. Add IPFS or similar for actual file storage
4. Implement challenge-response system for storage proofs
5. Add authentication and persistent sessions
6. Deploy Socket.io with Redis adapter for horizontal scaling
7. Add proper error handling and retry logic
8. Implement file chunking and Reed-Solomon encoding
9. Add reputation system and slashing for bad providers

## Vercel Deployment

The app is configured to work on both localhost and production:

```javascript
const socketUrl = process.env.NODE_ENV === 'production' 
  ? 'https://glacier-sigma.vercel.app'
  : 'http://localhost:3000'
```

**Note:** Vercel's serverless functions don't support persistent WebSocket connections. For production deployment with Socket.io, you would need:

1. Deploy the Socket.io server to a platform that supports persistent connections (Railway, Render, DigitalOcean, AWS)
2. Update the socket URL in `hooks/useSocket.ts` to point to your Socket.io server
3. Deploy the Next.js frontend to Vercel as normal

## Troubleshooting

**No providers showing up:**
- Make sure the provider browser window is still open
- Check browser console for Socket.io connection errors
- Verify server is running on port 3000

**File not downloading:**
- Check browser's download settings
- Look for blocked pop-ups or downloads
- Check browser console for errors

**Balance not updating:**
- Refresh the page
- Check browser's LocalStorage in DevTools
- Clear LocalStorage and re-register

**Socket disconnects:**
- Check network connectivity
- Look for port conflicts (3000)
- Restart the development server

## Future Enhancements

- [ ] WebRTC for direct peer-to-peer file transfer
- [ ] File chunking and parallel distribution
- [ ] Provider reputation and uptime tracking
- [ ] File retrieval system with decryption
- [ ] Smart contract integration for payments
- [ ] IPFS integration for decentralized storage
- [ ] Provider bandwidth/storage limits
- [ ] File expiration and garbage collection
- [ ] Multi-signature uploads for enterprise users
- [ ] Provider discovery protocol
