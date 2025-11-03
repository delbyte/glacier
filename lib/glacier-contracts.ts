import GlacierPaymentsABI from './contracts/GlacierPayments.json'

// Contract address from .env
export const GLACIER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GLACIER_CONTRACT_ADDRESS as `0x${string}`
export const FUJI_CHAIN_ID = 43113

// Contract ABI
export const GLACIER_PAYMENTS_ABI = GlacierPaymentsABI.abi

/**
 * Calculate upload cost for a file
 * Formula: (fileSize / 1MB) * 0.001 GLCR * 0.1 AVAX/GLCR
 * Conversion: 10 GLCR = 1 AVAX
 */
export function calculateUploadCostInAVAX(fileSizeBytes: number): bigint {
  // (fileSizeBytes / 1,048,576) * 0.001 GLCR * 0.1 AVAX/GLCR
  // Simplified: fileSizeBytes * 100000000000 / 1048576 (in wei)
  const costInWei = (BigInt(fileSizeBytes) * BigInt(100000000000)) / BigInt(1048576)
  return costInWei
}

/**
 * Calculate upload cost in GLCR for display
 * 1 AVAX = 10 GLCR
 */
export function calculateUploadCostInGLCR(fileSizeBytes: number): number {
  const fileSizeMB = fileSizeBytes / (1024 * 1024)
  return fileSizeMB * 0.001 // 0.001 GLCR per MB
}

/**
 * Convert AVAX to GLCR for display
 * 1 AVAX = 10 GLCR
 */
export function avaxToGLCR(avaxAmount: string): number {
  return parseFloat(avaxAmount) * 10
}

/**
 * Convert GLCR to AVAX
 * 10 GLCR = 1 AVAX
 */
export function glcrToAVAX(glcrAmount: number): string {
  return (glcrAmount / 10).toFixed(4)
}

/**
 * Format AVAX balance for display
 */
export function formatAVAX(avaxAmount: string | bigint): string {
  if (typeof avaxAmount === 'bigint') {
    const eth = Number(avaxAmount) / 1e18
    return eth.toFixed(4) + ' AVAX'
  }
  return parseFloat(avaxAmount).toFixed(4) + ' AVAX'
}

/**
 * Format GLCR balance for display
 */
export function formatGLCR(avaxAmount: string | bigint): string {
  if (typeof avaxAmount === 'bigint') {
    const eth = Number(avaxAmount) / 1e18
    const glcr = eth * 10
    return glcr.toFixed(4) + ' GLCR'
  }
  const glcr = parseFloat(avaxAmount) * 10
  return glcr.toFixed(4) + ' GLCR'
}
