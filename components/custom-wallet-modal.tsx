"use client";

import React, { useState } from "react";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/spotlight-card";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverBody,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverFooter
} from "@/components/popover";
import { Copy, ExternalLink, LogOut, CheckCircle } from "lucide-react";

interface CustomWalletModalProps {
  children: React.ReactNode;
}

export function CustomWalletModal({ children }: CustomWalletModalProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewOnExplorer = () => {
    if (address) {
      window.open(`https://testnet.snowtrace.io/address/${address}`, '_blank');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (!isConnected || !address) {
    return <>{children}</>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 border-0 bg-transparent">
        <GlowCard glowColor="ice" customSize={true} className="p-0">
          <PopoverHeader>
            <PopoverTitle>Wallet Details</PopoverTitle>
            <PopoverDescription>
              Manage your connected wallet
            </PopoverDescription>
          </PopoverHeader>
          
          <PopoverBody>
            <div className="space-y-4">
              {/* Address Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Address</label>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex flex-col">
                    <span className="text-sm font-mono text-white">
                      {ensName || `${address.slice(0, 8)}...${address.slice(-6)}`}
                    </span>
                    {ensName && (
                      <span className="text-xs text-gray-400 font-mono">
                        {`${address.slice(0, 8)}...${address.slice(-6)}`}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="h-8 w-8 p-0 hover:bg-gray-700"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Network Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Network</label>
                <div className="flex items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-white">Avalanche Fuji</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleViewOnExplorer}
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Explorer
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  className="w-full justify-start border-red-600 text-red-400 hover:bg-red-600/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect Wallet
                </Button>
              </div>
            </div>
          </PopoverBody>
        </GlowCard>
      </PopoverContent>
    </Popover>
  );
}