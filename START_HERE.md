# 🎯 EASIEST Way to Deploy - Follow This!

## What You're About To Do
Deploy your socket server so you can send files from your phone to your laptop (or vice versa).

---

## ⚡ Super Quick Method (5 minutes)

### Step 1: Run the Setup Script

Open PowerShell in your project folder and run:

```powershell
cd c:\Users\arnav\Desktop\web3-stuff\glacier
.\deploy-to-railway.ps1
```

This creates a `railway-deploy` folder with just the socket server files.

### Step 2: Push to GitHub

**Option A: Create New Repo (Recommended)**

1. Go to: https://github.com/new
2. Name: `glacier-socket-server`
3. Keep it public
4. **Don't** initialize with README
5. Click "Create repository"

Then in PowerShell:
```powershell
cd railway-deploy
git remote add origin https://github.com/delbyte/glacier-socket-server.git
git push -u origin main
```

**Option B: Use Existing Repo (Easier)**

```powershell
cd railway-deploy
git remote add origin https://github.com/delbyte/glacier.git
git push origin main:socket-server
```

### Step 3: Deploy to Railway

1. Go to: **https://railway.app/new**
2. Click: **"Login with GitHub"**
3. Click: **"Deploy from GitHub repo"**
4. Select: **glacier-socket-server** (or your repo)
5. Click: **"Deploy Now"**

⏳ Wait 1-2 minutes for deployment...

### Step 4: Get Your URL

1. In Railway dashboard, click **"Settings"** tab
2. Scroll to **"Networking"** section  
3. Click: **"Generate Domain"**
4. Copy the URL (e.g., `glacier-socket-production.up.railway.app`)

### Step 5: Update Your App

Create file `.env.local` in your glacier folder:

```bash
NEXT_PUBLIC_SOCKET_URL=https://glacier-socket-production.up.railway.app
```

(Replace with YOUR Railway URL)

### Step 6: Test It!

**On your laptop:**
```powershell
cd c:\Users\arnav\Desktop\web3-stuff\glacier
pnpm dev
```

Open: http://localhost:3000

Check browser console (F12), you should see:
```
🔌 Connecting to socket server: https://glacier-socket-production.up.railway.app
Socket connected: [some-id]
```

### Step 7: Deploy to Vercel (Optional)

If you want to test with the live site:

```powershell
vercel
```

Add environment variable in Vercel dashboard:
- Key: `NEXT_PUBLIC_SOCKET_URL`
- Value: `https://your-railway-url.up.railway.app`

Then redeploy.

---

## 🧪 Testing Cross-Device

**Laptop (Provider):**
1. Open: `http://localhost:3000` (or `https://glacier-sigma.vercel.app`)
2. Go to `/register`
3. Username: `laptop`
4. Select: "Provide Storage"
5. Click: "Create Account"
6. Keep browser open

**Phone (User):**
1. Open: `http://YOUR-LAPTOP-IP:3000` (same network) or `https://glacier-sigma.vercel.app`
2. Go to `/register`
3. Username: `phone`
4. Select: "Upload Files"
5. Upload a file with password: `test123`

**Expected:**
- ✅ File downloads on laptop automatically
- ✅ Filename is socket ID (e.g., `ABC123.jpg`)
- ✅ File is encrypted (unreadable without decryption)
- ✅ Laptop balance increases
- ✅ Phone balance decreases
- ✅ Provider dashboard shows file

---

## 🎨 About Using Same Username

You asked: *"What happens if I use the same username on phone and laptop without a database?"*

**Answer: It works perfectly fine!**

**Why:**
- Socket server identifies devices by **Socket ID**, not username
- Each device gets a unique Socket ID when connecting
- Username is just for display in the UI
- LocalStorage is separate per device

**Example:**
```
Laptop: Socket ID = ABC123, Username = "arnav" (localStorage on laptop)
Phone:  Socket ID = XYZ789, Username = "arnav" (localStorage on phone)
```

The system knows they're different devices because of Socket IDs. You can absolutely use "arnav" on both devices!

**What you'll see:**
- Laptop provider dashboard: Shows "arnav" as your username
- Phone upload: Shows files from "arnav" (the phone user)
- This is fine for a demo!

**What won't work:**
- Balances won't sync (laptop balance ≠ phone balance)
- Registration won't sync (need to register on each device)
- Dashboard history won't sync (each device has its own)

But file transfers will work perfectly! 🎉

---

## 🐛 Troubleshooting

### "Can't connect to socket server"

**Check Railway logs:**
1. Go to Railway dashboard
2. Click on your deployment
3. Click "Logs" tab
4. Should see: `✅ Socket.io server running on port XXXX`

**If no logs:**
- Check "Deployments" tab - should show green "Success"
- Check "Settings" → "Start Command" = `node socket-server.js`

### "CORS error in browser console"

**Fix:** Update `socket-server.js`:
```javascript
cors: {
  origin: [
    'http://localhost:3000',
    'https://glacier-sigma.vercel.app',
    'http://192.168.1.100:3000', // Add your laptop's local IP if testing on same network
  ]
}
```

Then commit and push - Railway auto-redeploys.

### "Socket connects but files don't transfer"

**Check:**
1. Both devices connected to SAME socket server (check browser console)
2. Provider is registered and online
3. User has sufficient GLCR balance
4. File size not too large (max 100MB)

**In Railway logs, you should see:**
```
Provider registered: laptop (ABC123)
User registered: phone (XYZ789)
File upload from phone: test.jpg
File distributed to 1 providers
```

### "Railway shows 'Application Failed'"

**Common causes:**
- Missing `package.json` - Make sure you copied `railway-package.json` as `package.json`
- Wrong Node version - Railway needs Node 18+
- Port binding issue - Make sure you use `process.env.PORT`

**Fix:**
```powershell
cd railway-deploy
# Make sure package.json exists
ls package.json

# Check socket-server.js uses process.env.PORT
# Should have: const PORT = process.env.PORT || 3001
```

---

## ✅ Final Checklist

Before testing cross-device, verify:

- [ ] Railway deployment shows "Success" (green)
- [ ] Railway domain generated and copied
- [ ] `.env.local` created with `NEXT_PUBLIC_SOCKET_URL`
- [ ] Local dev server restarted (`pnpm dev`)
- [ ] Browser console shows socket connection to Railway URL
- [ ] No CORS errors in console

Then test the full flow! 🚀

---

## 💡 Pro Tips

1. **Keep Railway logs open** during testing to see what's happening server-side
2. **Use browser console** on both devices to debug connection issues
3. **Test locally first** before testing cross-device
4. **Use same network** if testing phone + laptop (easier than using production URLs)
5. **Clear localStorage** if you need to re-register: `localStorage.clear()`

---

## 📞 Still Stuck?

Check these in order:

1. Railway logs - Is server running?
2. Browser console (F12) - Is socket connected?
3. Network tab (F12) - Are requests reaching Railway?
4. Railway Settings - Is domain generated?
5. `.env.local` - Is URL correct?

Most issues are either:
- Wrong socket URL in `.env.local`
- CORS not configured for your domain
- Railway deployment failed (check logs)

Fix those and you're golden! ✨
