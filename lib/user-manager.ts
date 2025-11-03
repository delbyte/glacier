// User and balance management using localStorage

export interface UserProfile {
  username: string
  isProvider: boolean
  balance: number
  createdAt: string
  walletAddress?: string // Ethereum wallet address for payments
}

export interface ReceivedFile {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  senderUsername: string
  receivedAt: string
  payment: number
  // Note: fileData not stored to avoid localStorage quota issues
}

export interface UploadedFile {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: string
  providerCount: number
  cost: number
  fileData: string // Store encrypted file data
}

const STORAGE_KEYS = {
  USER_PROFILE: 'glacier-user-profile',
  BALANCE: 'glacier-balance',
  RECEIVED_FILES: 'glacier-received-files',
  UPLOADED_FILES: 'glacier-uploaded-files',
  IS_PROVIDER: 'glacier-is-provider',
}

// Initialize user with free GLCR tokens
export const initializeUser = (username: string, isProvider: boolean = false): UserProfile => {
  const profile: UserProfile = {
    username,
    isProvider,
    balance: 1000, // Free 1000 GLCR to start
    createdAt: new Date().toISOString(),
  }
  
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile))
  return profile
}

// Get user profile
export const getUserProfile = (): UserProfile | null => {
  const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE)
  return profile ? JSON.parse(profile) : null
}

// Update user profile
export const updateUserProfile = (updates: Partial<UserProfile>): UserProfile => {
  const currentProfile = getUserProfile()
  if (!currentProfile) {
    throw new Error('No user profile found')
  }
  
  const updatedProfile = { ...currentProfile, ...updates }
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile))
  return updatedProfile
}

// Get balance
export const getBalance = (): number => {
  const profile = getUserProfile()
  return profile?.balance || 0
}

// Deduct balance
export const deductBalance = (amount: number): number => {
  const profile = getUserProfile()
  if (!profile) {
    throw new Error('No user profile found')
  }
  
  if (profile.balance < amount) {
    throw new Error('Insufficient balance')
  }
  
  const newBalance = profile.balance - amount
  updateUserProfile({ balance: newBalance })
  return newBalance
}

// Add balance
export const addBalance = (amount: number): number => {
  const profile = getUserProfile()
  if (!profile) {
    throw new Error('No user profile found')
  }
  
  const newBalance = profile.balance + amount
  updateUserProfile({ balance: newBalance })
  return newBalance
}

// Check if user is a provider
export const isUserProvider = (): boolean => {
  const profile = getUserProfile()
  return profile?.isProvider || false
}

// Set provider status
export const setProviderStatus = (isProvider: boolean): void => {
  updateUserProfile({ isProvider })
}

// Save received file (for providers)
export const saveReceivedFile = (file: ReceivedFile): void => {
  const files = getReceivedFiles()
  files.unshift(file) // Add to beginning
  localStorage.setItem(STORAGE_KEYS.RECEIVED_FILES, JSON.stringify(files))
}

// Get all received files (for providers)
export const getReceivedFiles = (): ReceivedFile[] => {
  const files = localStorage.getItem(STORAGE_KEYS.RECEIVED_FILES)
  return files ? JSON.parse(files) : []
}

// Save uploaded file (for users who upload)
export const saveUploadedFile = (file: UploadedFile): void => {
  const files = getUploadedFiles()
  files.unshift(file) // Add to beginning
  localStorage.setItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(files))
}

// Get all uploaded files (for users who upload)
export const getUploadedFiles = (): UploadedFile[] => {
  const files = localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES)
  return files ? JSON.parse(files) : []
}

// Clear user data (for testing)
export const clearUserData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

// Calculate cost based on file size and provider network
export const calculateUploadCost = (
  fileSizeBytes: number,
  providerNetwork: 'basic' | 'premium' | 'enterprise' = 'basic'
): number => {
  const fileSizeMB = fileSizeBytes / (1024 * 1024)
  
  // Base rate per MB
  const rates = {
    basic: 0.001,     // 0.001 GLCR per MB (95% uptime)
    premium: 0.0012,  // 0.0012 GLCR per MB (98% uptime)
    enterprise: 0.0015, // 0.0015 GLCR per MB (99.9% uptime)
  }
  
  const rate = rates[providerNetwork]
  return parseFloat((fileSizeMB * rate).toFixed(6))
}

// Format balance for display
export const formatBalance = (balance: number): string => {
  return balance.toFixed(4) + ' GLCR'
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
