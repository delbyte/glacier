// Utility to clear localStorage when quota is exceeded
// Run this in browser console if you encounter storage issues

export const clearGlacierStorage = () => {
  const keys = [
    'glacier-user-profile',
    'glacier-balance',
    'glacier-received-files',
    'glacier-is-provider',
    'glacier-uploaded-files', // Old key that may have large data
  ]
  
  keys.forEach(key => {
    try {
      localStorage.removeItem(key)
      console.log(`✓ Cleared ${key}`)
    } catch (error) {
      console.error(`✗ Failed to clear ${key}:`, error)
    }
  })
  
  console.log('✅ Glacier storage cleared. Please refresh the page.')
}

// For browser console: window.clearGlacierStorage = clearGlacierStorage
if (typeof window !== 'undefined') {
  (window as any).clearGlacierStorage = clearGlacierStorage
}
