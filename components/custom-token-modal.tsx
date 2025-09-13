"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
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
import { Coins, CheckCircle, Loader2, ExternalLink } from "lucide-react";

// GLCR Token contract on Avalanche Fuji Testnet
const GLCR_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" as const;

const GLCR_ABI = [
  {
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface CustomTokenModalProps {
  children: React.ReactNode;
}

export function CustomTokenModal({ children }: CustomTokenModalProps) {
  const { address, isConnected } = useAccount();
  const [hasClaimed, setHasClaimed] = useState(false);

  // Get token decimals
  const { data: decimals } = useReadContract({
    address: GLCR_CONTRACT_ADDRESS,
    abi: GLCR_ABI,
    functionName: "decimals",
  });

  // Get token balance
  const { data: balance } = useReadContract({
    address: GLCR_CONTRACT_ADDRESS,
    abi: GLCR_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { writeContract, isPending } = useWriteContract();

  const handleClaimTokens = () => {
    if (!address || !isConnected) return;

    try {
      const tokenAmount = BigInt(1000) * (BigInt(10) ** BigInt(decimals || 18));
      
      writeContract({
        address: GLCR_CONTRACT_ADDRESS,
        abi: GLCR_ABI,
        functionName: "mint",
        args: [address, tokenAmount],
      });

      setHasClaimed(true);
    } catch (error) {
      console.error("Error claiming tokens:", error);
      setHasClaimed(false);
    }
  };

  const handleViewOnExplorer = () => {
    window.open(`https://testnet.snowtrace.io/token/${GLCR_CONTRACT_ADDRESS}`, '_blank');
  };

  const formatBalance = (bal: bigint | undefined) => {
    if (!bal) return "0";
    return `${Number(bal) / 10**18}`;
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
              <Coins className="w-5 h-5 text-blue-400" />
              GLCR Token Details
            </PopoverTitle>
            <PopoverDescription>
              Manage your GLCR tokens for Glacier storage
            </PopoverDescription>
          </PopoverHeader>
          
          <PopoverBody>
            <div className="space-y-4">
              {/* Balance Display */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-300">Your Balance</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatBalance(balance)} GLCR
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Token Contract</p>
                    <p className="text-xs text-gray-300 font-mono">
                      {`${GLCR_CONTRACT_ADDRESS.slice(0, 6)}...${GLCR_CONTRACT_ADDRESS.slice(-4)}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Claim Section */}
              {!hasClaimed && Number(formatBalance(balance)) < 1000 && (
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-300 mb-2">
                      Get free GLCR tokens to start using Glacier
                    </p>
                    <Button
                      onClick={handleClaimTokens}
                      disabled={isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          Claim 1000 GLCR
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Success State */}
              {hasClaimed && (
                <div className="text-center p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-green-300 font-medium">
                    Tokens claimed successfully!
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    You can now upload files to Glacier
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col space-y-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleViewOnExplorer}
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Token Contract
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  GLCR tokens are used to pay for storage on the Glacier network
                </p>
              </div>
            </div>
          </PopoverBody>
        </GlowCard>
      </PopoverContent>
    </Popover>
  );
}