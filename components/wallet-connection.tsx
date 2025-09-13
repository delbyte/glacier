"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { CustomWalletModal } from "@/components/custom-wallet-modal";
import { CustomChainModal } from "@/components/custom-chain-modal";

interface WalletConnectionProps {
  className?: string;
  showBalance?: boolean;
}

export function WalletConnection({ className = "", showBalance = true }: WalletConnectionProps) {
  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="text-sm text-gray-300">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus || authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        onClick={openConnectModal}
                        size="lg"
                      >
                        Connect Wallet
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <CustomChainModal>
                        <Button variant="destructive">
                          Wrong network
                        </Button>
                      </CustomChainModal>
                    );
                  }

                  return (
                    <div className="flex items-center gap-2">
                      <CustomChainModal>
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: "hidden",
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </Button>
                      </CustomChainModal>

                      <CustomWalletModal>
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          {account.displayName}
                          {account.displayBalance ? ` (${account.displayBalance})` : ""}
                        </Button>
                      </CustomWalletModal>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    );
  }

  return (
    <div className={className}>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      onClick={openConnectModal}
                      size="lg"
                    >
                      Connect Core
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <CustomChainModal>
                      <Button variant="destructive">
                        Wrong network
                      </Button>
                    </CustomChainModal>
                  );
                }

                return (
                  <div className="flex items-center gap-2">
                    <CustomChainModal>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </Button>
                    </CustomChainModal>

                    <CustomWalletModal>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        {account.displayName}
                        {account.displayBalance ? ` (${account.displayBalance})` : ""}
                      </Button>
                    </CustomWalletModal>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}