# Testing Glacier on Avalanche Fuji Testnet

This guide walks you through testing the live Glacier smart contract deployed on Avalanche Fuji testnet.

## 🎯 Contract Details

- **Contract Address**: `0x22f91573C8882E5F45E4931e298E9752952A991f`
- **Network**: Avalanche Fuji C-Chain (Testnet)
- **Chain ID**: 43113
- **Explorer**: https://testnet.snowtrace.io/address/0x22f91573C8882E5F45E4931e298E9752952A991f

## 📋 Prerequisites

### 1. Wallet Setup

You'll need either **Core Wallet** or **MetaMask** installed:

- **Core Wallet** (Recommended for Avalanche): https://core.app/
- **MetaMask**: https://metamask.io/

### 2. Add Avalanche Fuji Testnet

If using MetaMask, manually add the network:

- **Network Name**: Avalanche Fuji C-Chain
- **RPC URL**: `https://api.avax-test.network/ext/bc/C/rpc`
- **Chain ID**: `43113`
- **Currency Symbol**: `AVAX`
- **Block Explorer**: `https://testnet.snowtrace.io`

*Core Wallet has Fuji testnet built-in.*

### 3. Get Test AVAX

Visit the Avalanche Faucet and request test AVAX:

1. Go to: https://faucet.avax.network/
2. Select **Fuji (C-Chain)**
3. Enter your wallet address
4. Complete the captcha
5. Receive **0.5 AVAX** (takes ~30 seconds)

> **Note**: You need at least 0.001 AVAX to test file uploads. The faucet gives you enough for ~5000 uploads!

## 🧪 Testing Flow

### Phase 1: Setup (5 minutes)

1. **Connect Wallet**
   - Open your Glacier app (locally or deployed)
   - Click "Connect Wallet" button (top right)
   - Approve connection in wallet popup
   - Confirm you're on **Fuji testnet** (not mainnet!)

2. **Verify Contract Connection**
   - Once connected, your wallet balance should show in AVAX
   - Should see: "X.XXXX AVAX" and "≈ X.XXXX GLCR"

### Phase 2: Provider Registration (2 minutes)

1. **Open Provider Dashboard**
   - Navigate to `/provider` page
   - Ensure wallet is still connected

2. **Register as Provider**
   - Enter a username (e.g., "test-provider")
   - Click "Start Providing Storage"
   - **Important**: Keep this browser tab open! Providers must be online to receive files

3. **Verify Registration**
   - Status should show "Online & Receiving" (green indicator)
   - Contract Earnings should show "0.0000 AVAX"

### Phase 3: File Upload (5 minutes)

1. **Open Upload Interface** (in a new tab or different device)
   - Navigate to `/upload` page
   - Connect wallet (can be same or different wallet)
   - Ensure you have test AVAX in your balance

2. **Prepare File**
   - Create a test file (or use existing)
   - Recommended: Start with a small file (< 1 MB)
   - Example: Create `test.txt` with some text content

3. **Upload Process**
   - Drag & drop file or click to select
   - Enter a password (e.g., "test123") - **Remember this!**
   - Verify upload cost shows: ~0.0001 AVAX for 1MB file
   - Ensure at least 1 provider is online (shows green count)
   - Click "Upload File"

4. **Transaction Confirmation**
   - Wallet popup will appear showing transaction details:
     - **To**: Contract address (0x22f9...)
     - **Value**: Upload cost in AVAX
     - **Gas**: ~0.0001 AVAX
   - Click "Confirm" in wallet
   - Wait for "Upload successful!" message

5. **Transaction Verification on Snowtrace**
   - Click the transaction hash link (or check wallet history)
   - Should open Snowtrace explorer showing:
     - ✅ **Status**: Success
     - **From**: Your wallet address
     - **To**: Contract address
     - **Value**: Payment amount
     - **Logs**: Look for "FileUploaded" event

### Phase 4: Provider Receives File (Instant)

1. **Switch to Provider Tab**
   - Should see automatic file download (or notification)
   - File will be encrypted with the password
   - Provider dashboard should update with:
     - New file in "Received Files" list
     - Contract Earnings increased (e.g., 0.0001 AVAX)

2. **View Provider Dashboard**
   - Navigate to `/provider-dashboard`
   - Verify:
     - Files Stored: 1 (or more)
     - Contract Earnings: Shows AVAX amount
     - File details: Name, size, sender

### Phase 5: Withdraw Earnings (3 minutes)

1. **On Provider Dashboard**
   - Scroll to "Contract Earnings" card
   - Click "Withdraw Earnings" button

2. **Transaction Confirmation**
   - Wallet popup shows withdrawal transaction
   - Click "Confirm"
   - Wait for "Successfully withdrawn earnings!" message

3. **Verify Withdrawal**
   - Contract Earnings should reset to 0.0000 AVAX
   - Your wallet balance should increase
   - Check Snowtrace for withdrawal transaction:
     - Look for "EarningsWithdrawn" event in logs

### Phase 6: Verify on Blockchain Explorer (5 minutes)

1. **View Contract on Snowtrace**
   - Visit: https://testnet.snowtrace.io/address/0x22f91573C8882E5F45E4931e298E9752952A991f
   - Should see:
     - ✅ Contract is verified
     - Transaction history (Txn Hash column)
     - Internal transactions (transfers to providers)

2. **Explore Upload Transaction**
   - Click on your upload transaction hash
   - **Overview Tab**: Shows payment amount and gas used
   - **Logs Tab**: Shows events:
     ```
     FileUploaded (providers: [0x...], fileSizeBytes: X, totalCost: Y)
     PaymentDistributed (provider: 0x..., amount: Z)
     ```

3. **Explore Withdrawal Transaction**
   - Click on withdrawal transaction hash
   - **Logs Tab**: Shows events:
     ```
     EarningsWithdrawn (provider: 0x..., amount: Z)
     ```

## 📊 Demo Script (For Presentations)

Use this script to demonstrate live testnet functionality:

### Setup (Pre-Demo)
```
1. Have 2 browser windows ready
2. Provider window: Already registered and online
3. User window: Connected wallet with test AVAX
4. Have Snowtrace contract page open in background
```

### Demo Steps (5-7 minutes)

**[Show Contract]**
> "This is our smart contract deployed on Avalanche Fuji testnet at address 0x22f9... Let me show you it's live and verified on Snowtrace."

*Switch to Snowtrace tab, show contract code and recent transactions*

---

**[Show Provider]**
> "First, I've registered as a storage provider. As you can see, I'm online and ready to receive files. My current earnings are showing here in AVAX."

*Show provider dashboard with 0 earnings*

---

**[Upload File]**
> "Now let me upload a file. I'll select this test document... enter an encryption password... and you can see the upload cost calculated by the smart contract - about 0.0001 AVAX for this 1MB file."

*Show upload interface, select file, enter password*

> "When I click Upload, my wallet will prompt me to confirm the transaction. This payment will go directly to the smart contract, which will then distribute it to the provider."

*Click Upload, show MetaMask confirmation*

> "I'll confirm the transaction... and we wait a few seconds for blockchain confirmation..."

*Wait for success message*

---

**[Show Blockchain Confirmation]**
> "Great! Upload successful. Let me show you this transaction live on Snowtrace."

*Click transaction link, show Snowtrace page*

> "Here we can see the transaction details - the payment amount, gas used, and most importantly in the Logs section, the FileUploaded event showing which providers received the file and how the payment was distributed."

*Point to logs section*

---

**[Show Provider Received File]**
> "Now switching back to my provider window - the file has already been received and downloaded automatically. And you can see my earnings have updated to show the AVAX I just earned."

*Show provider dashboard with updated earnings*

---

**[Withdraw Earnings]**
> "As a provider, I can withdraw my earnings at any time. Let me click this Withdraw button..."

*Click Withdraw Earnings*

> "Again, wallet confirmation... and we wait for the transaction..."

*Confirm transaction, wait*

> "Perfect! My earnings have been transferred to my wallet. Let me show you this withdrawal transaction on Snowtrace as well."

*Show withdrawal transaction on Snowtrace with EarningsWithdrawn event*

---

**[Conclusion]**
> "So what we've just demonstrated is a complete end-to-end flow on a live testnet: file upload with payment, real-time provider delivery, and earnings withdrawal - all secured by smart contracts on the Avalanche blockchain."

---

## 🎬 Advanced Testing

### Multi-Provider Test
1. Open 3 browser windows (or use different devices)
2. Register 2 providers in separate windows
3. Upload a file from the 3rd window
4. Verify payment is split between both providers
5. Check Snowtrace for multiple PaymentDistributed events

### File Download Test
1. After uploading with password "test123"
2. As provider, download the received file
3. File should be encrypted (gibberish when opened)
4. Use decryption tool (if available) with same password
5. Verify original file is recovered

### Cost Calculation Test
Upload files of different sizes and verify costs:
- **1 MB file**: ~0.0001 AVAX (0.001 GLCR)
- **10 MB file**: ~0.001 AVAX (0.01 GLCR)
- **100 MB file**: ~0.01 AVAX (0.1 GLCR)

Formula: `(fileSizeBytes / 1MB) * 0.001 GLCR * 0.1 AVAX/GLCR`

## 🐛 Troubleshooting

### "Insufficient balance" error
- Check you're on Fuji testnet (not mainnet)
- Get test AVAX from faucet
- Ensure you have > 0.001 AVAX

### "No providers available" error
- Ensure at least one provider tab is open
- Provider must show "Online & Receiving" status
- Try refreshing provider page

### Wallet not connecting
- Check wallet is unlocked
- Switch to Fuji testnet in wallet
- Try disconnecting and reconnecting
- Clear browser cache if persists

### Transaction failing
- Check you have enough AVAX for gas
- Ensure provider is online
- Verify you're calling the correct contract
- Check Snowtrace for revert reason

### File not received by provider
- Ensure socket server is running
- Check browser console for errors
- Verify provider stayed online during upload
- Try re-registering as provider

## 📈 Expected Gas Costs

All costs in AVAX on Fuji testnet:

| Operation | Gas Cost | Total Cost (with file) |
|-----------|----------|------------------------|
| Upload 1MB file | ~0.0001 AVAX | ~0.0002 AVAX |
| Upload 10MB file | ~0.0001 AVAX | ~0.0011 AVAX |
| Withdraw earnings | ~0.00005 AVAX | ~0.00005 AVAX |

*Gas costs are approximate and depend on network congestion*

## ✅ Success Criteria

Your test is successful if:

- ✅ Wallet connects to Fuji testnet
- ✅ Provider can register and stay online
- ✅ File upload transaction confirms on blockchain
- ✅ Provider receives file automatically
- ✅ Contract earnings show in provider dashboard
- ✅ Earnings can be withdrawn to wallet
- ✅ All transactions visible on Snowtrace with correct events

## 🔗 Useful Links

- **Faucet**: https://faucet.avax.network/
- **Contract**: https://testnet.snowtrace.io/address/0x22f91573C8882E5F45E4931e298E9752952A991f
- **Fuji RPC**: https://api.avax-test.network/ext/bc/C/rpc
- **Avalanche Docs**: https://docs.avax.network/
- **Core Wallet**: https://core.app/

---

**Need Help?** Check contract logs on Snowtrace or browser console for detailed error messages.
