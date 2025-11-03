# ✅ Cross-Device Testing Checklist

Use this checklist to verify everything works after Railway deployment.

---

## Pre-Flight Check

- [ ] Railway deployment successful (green status)
- [ ] Railway domain generated: `___________________________.up.railway.app`
- [ ] `.env.local` created with correct Railway URL
- [ ] Local dev server running: `pnpm dev`
- [ ] No errors in terminal

---

## Connection Test (Laptop)

Open: `http://localhost:3000` or `https://glacier-sigma.vercel.app`

**Browser Console (F12):**
- [ ] See: `🔌 Connecting to socket server: https://...`
- [ ] See: `Socket connected: [socket-id]`
- [ ] No CORS errors
- [ ] No connection errors

---

## Provider Registration (Laptop)

1. Navigate to `/register`
2. Enter username: `laptop-provider`
3. Select: "Provide Storage"
4. Click: "Create Account"

**Verify:**
- [ ] Redirected to `/provider-dashboard`
- [ ] Shows online status (green)
- [ ] Shows GLCR balance: 1000.0000 GLCR
- [ ] No errors in console

**Browser Console Should Show:**
- [ ] `Provider registered: laptop-provider`
- [ ] Socket connection maintained

**Railway Logs Should Show:**
```
Provider registered: laptop-provider (ABC123...)
```

---

## User Registration (Phone/Second Device)

Open: `https://glacier-sigma.vercel.app` or `http://YOUR-IP:3000`

1. Navigate to `/register`
2. Enter username: `phone-user`
3. Select: "Upload Files"
4. Click: "Create Account"

**Verify:**
- [ ] Redirected to `/upload`
- [ ] Shows online status
- [ ] Shows GLCR balance: 1000.0000 GLCR
- [ ] Sees "1 Provider Online"

**Browser Console Should Show:**
- [ ] `Socket connected: [different-socket-id]`
- [ ] `User registered: phone-user`
- [ ] Provider list update received

---

## File Upload Test (Phone)

1. Click "Choose File" or drag & drop
2. Select a small image (< 5MB for testing)
3. Enter password: `test123`
4. Click "Upload to Network"

**Verify:**
- [ ] Upload progress bar appears
- [ ] Shows cost (e.g., "0.0068 GLCR")
- [ ] Upload completes (100%)
- [ ] Shows success message
- [ ] Balance decreases

**Browser Console Should Show:**
- [ ] `File upload from phone-user: ...`
- [ ] `Upload successful! Sent to 1 providers`
- [ ] No errors

**Railway Logs Should Show:**
```
File upload from phone-user: test.jpg (123456 bytes)
File distributed to 1 providers
```

---

## File Receipt Test (Laptop Provider)

**Within 2-5 seconds:**

**File Download:**
- [ ] Browser triggers automatic download
- [ ] File appears in Downloads folder
- [ ] Filename is socket ID (e.g., `ABC123XYZ.jpg`)
- [ ] File is encrypted (try opening - should be corrupted/unreadable)

**Dashboard Update:**
- [ ] Dashboard shows new file in received files list
- [ ] Shows original filename (not socket ID)
- [ ] Shows sender: "phone-user"
- [ ] Shows payment amount (e.g., "+0.0068 GLCR")
- [ ] Balance increases
- [ ] Total earned updates
- [ ] Files stored count increases

**Browser Console Should Show:**
- [ ] `File received: [socket-id].jpg from phone-user`
- [ ] `File downloaded: [socket-id].jpg`
- [ ] Payment notification

**Browser Notification (if enabled):**
- [ ] Notification appears: "File Received - test.jpg from phone-user (+0.0068 GLCR)"

---

## Balance Verification

**Phone (User):**
- Starting balance: 1000.0000 GLCR
- Cost: ~0.0068 GLCR (for ~5MB file)
- **Expected:** 999.9932 GLCR
- [ ] Balance correct

**Laptop (Provider):**
- Starting balance: 1000.0000 GLCR
- Payment: ~0.0068 GLCR
- **Expected:** 1000.0068 GLCR
- [ ] Balance correct

---

## Multi-File Test

Upload 2-3 more files from phone:

- [ ] Each file downloads on laptop
- [ ] Each file has unique socket ID filename
- [ ] Dashboard shows all files
- [ ] Balances update for each transfer
- [ ] No errors in console
- [ ] Railway logs show all transfers

---

## Edge Cases

### Test: No Providers Online

1. Close laptop browser (provider goes offline)
2. Try uploading from phone

**Expected:**
- [ ] Shows "0 Providers Online"
- [ ] Shows error: "No providers available"
- [ ] Balance NOT deducted
- [ ] File NOT uploaded

### Test: Insufficient Balance

1. Open browser console on phone
2. Run: `localStorage.setItem('glacier-user-profile', JSON.stringify({username: 'phone-user', isProvider: false, balance: 0.0001, createdAt: new Date().toISOString()}))`
3. Refresh page
4. Try uploading large file

**Expected:**
- [ ] Shows error: "Insufficient balance"
- [ ] File NOT uploaded
- [ ] Balance NOT deducted

### Test: Provider Also Uploads

1. Laptop (provider) goes to `/upload`
2. Upload a file

**Expected:**
- [ ] File does NOT download on laptop (self-exclusion)
- [ ] Balance deducted on laptop
- [ ] Railway logs show: "No providers available" or "File distributed to 0 providers"

---

## Encryption Verification

**On laptop, check the downloaded file:**

1. Find file in Downloads folder (name = socket ID)
2. Try to open with image viewer

**Expected:**
- [ ] File CANNOT be opened
- [ ] Shows as corrupted
- [ ] OR shows random noise/static
- [ ] Proves file is encrypted!

**To decrypt (manually test encryption):**

*Note: Current implementation doesn't have decryption UI yet. This is for verifying encryption works.*

---

## Cross-Browser Test

Test with different browser combinations:

- [ ] Chrome (laptop) ↔ Safari (phone)
- [ ] Firefox (laptop) ↔ Chrome (phone)
- [ ] Edge (laptop) ↔ Firefox (phone)

All should work identically!

---

## Network Test

**Same Network (Local):**
- [ ] Phone connects to `http://[laptop-ip]:3000`
- [ ] Provider registration works
- [ ] File transfer works

**Different Networks (Production):**
- [ ] Both devices use `https://glacier-sigma.vercel.app`
- [ ] Both connect to same Railway socket server
- [ ] File transfer works

---

## Performance Test

Upload progressively larger files:

- [ ] 1MB file - works
- [ ] 5MB file - works
- [ ] 10MB file - works
- [ ] 50MB file - works (may take longer)
- [ ] 100MB file - works or shows appropriate error

**Monitor:**
- Railway server memory usage
- Upload/download speed
- Console for any warnings

---

## Railway Logs Analysis

Check Railway logs for the complete session:

**Should see:**
```
✅ Socket.io server running on port 3001
Client connected: ABC123...
Provider registered: laptop-provider (ABC123...)
Client connected: XYZ789...
User registered: phone-user (XYZ789...)
File upload from phone-user: test.jpg (123456 bytes)
File distributed to 1 providers
```

**Should NOT see:**
- Connection errors
- CORS errors
- Socket disconnections (except intentional)
- File distribution errors

---

## Final Verification

- [ ] Multiple files transferred successfully
- [ ] All files encrypted with correct filenames
- [ ] Balances accurate for all transfers
- [ ] Dashboard shows complete history
- [ ] No console errors
- [ ] No Railway errors
- [ ] Cross-device works reliably
- [ ] Provider self-exclusion works
- [ ] Payment distribution correct

---

## 🎉 Success Criteria

✅ **PASS** if all core tests pass:
1. Provider registration works
2. User registration works
3. File upload triggers download on provider
4. Files are encrypted
5. Balances update correctly
6. Cross-device transfers work

⚠️ **MINOR ISSUES** acceptable for demo:
- Notification permissions not granted
- Slightly slow transfers on cellular
- LocalStorage doesn't sync (expected)

❌ **FAIL** if critical issues:
- Files don't transfer between devices
- Socket connections fail
- Files are not encrypted
- Balances don't update

---

## 📝 Notes Section

Record any issues or observations:

**Issue 1:**
- What happened: ___________________________________
- When: ___________________________________________
- Fix: ____________________________________________

**Issue 2:**
- What happened: ___________________________________
- When: ___________________________________________
- Fix: ____________________________________________

**Performance Notes:**
- Upload speed: ____________________________________
- Download speed: __________________________________
- Railway server latency: ___________________________

---

## 🚀 Ready to Demo!

Once all tests pass, your system is ready to show off:

- ✅ Real-time file distribution
- ✅ Encryption working
- ✅ Payment system functional
- ✅ Cross-device transfers
- ✅ Production-ready architecture

Congrats! 🎊
