"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

// GLCR Token contract on Avalanche Fuji Testnet (replace with actual deployed contract)
const GLCR_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" as const;

// ERC20 ABI for GLCR token
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

export function TokenClaim() {
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

  const { writeContract, isPending, data: hash } = useWriteContract();

  const handleClaimTokens = () => {
    if (!address || !isConnected) return;

    try {
      // Calculate 1000 tokens with proper decimals
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

  if (!isConnected) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Claim Free GLCR Tokens</CardTitle>
          <CardDescription className="text-gray-400">
            Connect your wallet to claim 1000 free GLCR tokens to get started with Glacier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Please connect your MetaMask wallet first</p>
        </CardContent>
      </Card>
    );
  }

  if (hasClaimed) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-white" />
            Tokens Claimed Successfully!
          </CardTitle>
          <CardDescription className="text-gray-400">
            You have received 1000 GLCR tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-300">
              <strong>Balance:</strong> {balance ? `${Number(balance) / 10**18} GLCR` : "1000 GLCR"}
            </p>
            <p className="text-xs text-gray-500">
              You can now upload files to the Glacier network
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Claim Free GLCR Tokens</CardTitle>
        <CardDescription className="text-gray-400">
          Get 1000 free GLCR tokens to start using Glacier's decentralized storage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Free GLCR Tokens</p>
                <p className="text-2xl font-bold text-blue-400">1000 GLCR</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Current Balance</p>
                <p className="text-sm text-gray-300">
                  {balance ? `${Number(balance) / 10**18} GLCR` : "0 GLCR"}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleClaimTokens}
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Claiming Tokens...
              </>
            ) : (
              "Claim 1000 Free GLCR Tokens"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            These tokens will be used to pay for storage on the Glacier network
          </p>
        </div>
      </CardContent>
    </Card>
  );
}