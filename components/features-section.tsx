import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Cryptographic Proofs",
    description:
      "Every file is verified through mathematical proofs. Providers must prove they're storing your data correctly.",
    icon: "🔐",
  },
  {
    title: "Smart Contract Escrow",
    description: "Payments are held in smart contracts and released automatically when storage conditions are met.",
    icon: "📋",
  },
  {
    title: "File Encryption & Chunking",
    description: "Files are encrypted client-side, split into chunks, and distributed across multiple providers.",
    icon: "🧩",
  },
  {
    title: "Avalanche Powered",
    description: "Built on Avalanche for fast, low-cost transactions and robust smart contract execution.",
    icon: "⚡",
  },
  {
    title: "Proof of Retrievability",
    description: "Periodic challenges ensure providers maintain your data with cryptographic verification.",
    icon: "✅",
  },
  {
    title: "Decentralized Network",
    description: "No single point of failure. Your data is distributed across a global network of providers.",
    icon: "🌐",
  },
]

export function FeaturesSection() {
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
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
