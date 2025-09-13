import { http, createConfig } from 'wagmi'
import { avalancheFuji } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [avalancheFuji],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [avalancheFuji.id]: http(),
  },
  batch: {
    multicall: true,
  },
  pollingInterval: 12_000, // Reduce polling frequency
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}