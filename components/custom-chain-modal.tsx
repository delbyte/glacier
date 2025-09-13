"use client";

import React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/spotlight-card";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverBody,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription
} from "@/components/popover";
import { Network, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { avalancheFuji, avalanche } from "wagmi/chains";

interface CustomChainModalProps {
  children: React.ReactNode;
}

export function CustomChainModal({ children }: CustomChainModalProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  // Supported chains for Glacier
  const supportedChains = [
    {
      ...avalancheFuji,
      displayName: "Avalanche Fuji Testnet",
      description: "Recommended for testing",
      isTestnet: true,
    },
    {
      ...avalanche,
      displayName: "Avalanche Mainnet", 
      description: "Production network",
      isTestnet: false,
    },
  ];

  const currentChain = supportedChains.find(chain => chain.id === chainId);
  const isUnsupportedChain = !currentChain;

  const handleSwitchChain = (chain: typeof supportedChains[0]) => {
    switchChain({ chainId: chain.id as any });
  };

  const handleViewExplorer = (chain: typeof supportedChains[0]) => {
    if (chain.blockExplorers?.default?.url) {
      window.open(chain.blockExplorers.default.url, '_blank');
    }
  };

  if (!isConnected) {
    return <>{children}</>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent align="center" className="w-80 p-0 border-0 bg-transparent">
        <GlowCard glowColor="arctic" customSize={true} className="p-0">
          <PopoverHeader>
            <PopoverTitle className="flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-400" />
              Network Selection
            </PopoverTitle>
            <PopoverDescription>
              Choose your preferred network for Glacier
            </PopoverDescription>
          </PopoverHeader>
          
          <PopoverBody>
            <div className="space-y-4">
              {/* Current Network Status */}
              {isUnsupportedChain ? (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-sm font-medium text-red-300">Unsupported Network</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Please switch to a supported network to use Glacier
                  </p>
                </div>
              ) : (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-sm font-medium text-green-300">Connected to {currentChain?.displayName}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {currentChain?.description}
                  </p>
                </div>
              )}

              {/* Available Networks */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300 mb-3">Available Networks</p>
                {supportedChains.map((chain) => {
                  const isCurrentChain = chainId === chain.id;
                  const isTestnet = chain.isTestnet;
                  
                  return (
                    <div
                      key={chain.id}
                      className={`
                        border rounded-lg p-3 transition-all
                        ${isCurrentChain 
                          ? 'border-blue-500/50 bg-blue-900/20' 
                          : 'border-gray-600/50 bg-gray-800/20 hover:border-gray-500/50 hover:bg-gray-700/20'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Chain Icon */}
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">A</span>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white">{chain.displayName}</p>
                              {isTestnet && (
                                <span className="px-2 py-0.5 text-xs bg-yellow-900/30 text-yellow-300 rounded">
                                  Testnet
                                </span>
                              )}
                              {isCurrentChain && (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              )}
                            </div>
                            <p className="text-xs text-gray-400">{chain.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewExplorer(chain)}
                            className="text-gray-400 hover:text-white"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          
                          {!isCurrentChain && (
                            <Button
                              size="sm"
                              onClick={() => handleSwitchChain(chain)}
                              disabled={isPending}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {isPending ? "Switching..." : "Switch"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Glacier works best on Avalanche networks for optimal storage performance
                </p>
              </div>
            </div>
          </PopoverBody>
        </GlowCard>
      </PopoverContent>
    </Popover>
  );
}