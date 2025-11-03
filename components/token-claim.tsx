"use client";

import { useAccount, useBalance } from "wagmi";
import { GlowCard } from "@/components/spotlight-card";
import { Wallet, ExternalLink } from "lucide-react";
import { formatAVAX, formatGLCR } from "@/lib/glacier-contracts";
import { Button } from "@/components/ui/button";

export function TokenClaim() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const handleGetTestAVAX = () => {
    window.open('https://faucet.avax.network/', '_blank');
  };

  if (!isConnected) {
    return (
      <GlowCard glowColor="frost" customSize={true} className="p-4 sm:p-6">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Balance
          </h3>
          <p className="text-sm text-gray-400">
            Connect your wallet to view your AVAX balance
          </p>
          <p className="text-xs text-gray-500">Payments are processed on Avalanche Fuji testnet</p>
        </div>
      </GlowCard>
    );
  }

  const avaxBalance = balanceData?.value || BigInt(0);
  const isLowBalance = avaxBalance < BigInt(1000000000000000); // Less than 0.001 AVAX

  return (
    <GlowCard glowColor="arctic" customSize={true} className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            Your Wallet Balance
          </h3>
          <p className="text-sm text-gray-400">
            AVAX balance on Fuji testnet
          </p>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-blue-300">Available Balance</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatAVAX(avaxBalance)}
              </p>
              <p className="text-sm text-gray-400">
                ≈ {formatGLCR(avaxBalance)}
              </p>
            </div>
            {isLowBalance && (
              <div className="pt-2 border-t border-blue-500/20">
                <p className="text-xs text-yellow-400 mb-2">
                  ⚠️ Low balance. Get free test AVAX to upload files
                </p>
                <Button
                  onClick={handleGetTestAVAX}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Get Test AVAX from Faucet
                </Button>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Upload files cost ~0.0001 AVAX per MB
        </p>
      </div>
    </GlowCard>
  );
}