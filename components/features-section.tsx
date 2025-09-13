import React from "react"
import { GlowCard } from "@/components/spotlight-card"
import { Lock, FileText, Puzzle, Zap, CheckCircle, Globe } from "lucide-react"

const features = [
  {
    title: "Cryptographic Proofs",
    description:
      "Every file is verified through mathematical proofs. Providers must prove they're storing your data correctly.",
    icon: Lock,
  },
  {
    title: "Smart Contract Escrow",
    description: "Payments are held in smart contracts and released automatically when storage conditions are met.",
    icon: FileText,
  },
  {
    title: "File Encryption & Chunking",
    description: "Files are encrypted client-side, split into chunks, and distributed across multiple providers.",
    icon: Puzzle,
  },
  {
    title: "Avalanche Powered",
    description: "Built on Avalanche for fast, low-cost transactions and robust smart contract execution.",
    icon: Zap,
  },
  {
    title: "Proof of Retrievability",
    description: "Periodic challenges ensure providers maintain your data with cryptographic verification.",
    icon: CheckCircle,
  },
  {
    title: "Decentralized Network",
    description: "No single point of failure. Your data is distributed across a global network of providers.",
    icon: Globe,
  },
]

export const FeaturesSection = React.memo(() => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">How Glacier Ensures Trust</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Advanced cryptographic techniques and blockchain technology create a trustless storage network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlowCard key={index} glowColor="glacier" customSize={true} className="p-6 h-80">
              <div className="text-4xl mb-4">
                <feature.icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">{feature.description}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
})
