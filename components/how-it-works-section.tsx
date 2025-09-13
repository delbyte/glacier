import { GlowCard } from "@/components/spotlight-card"

const steps = [
  {
    step: "1",
    title: "Upload & Encrypt",
    description:
      "Your file is encrypted in your browser with a password you control. It's then split into chunks and hashed for verification.",
    details: "Client-side AES encryption ensures your data remains private. Each chunk gets a unique SHA-256 hash.",
  },
  {
    step: "2",
    title: "Distribute Across Network",
    description:
      "Chunks are distributed to multiple storage providers across the network. No single provider has your complete file.",
    details: "Smart contracts manage provider selection and ensure redundancy across geographically distributed nodes.",
  },
  {
    step: "3",
    title: "Smart Contract Escrow",
    description:
      "Payment is locked in smart contracts. Providers stake collateral and must prove they're storing your data correctly.",
    details: "Automated escrow releases payments only when cryptographic proofs verify successful storage.",
  },
  {
    step: "4",
    title: "Ongoing Verification",
    description:
      "Periodic challenges verify providers still have your data. Failed challenges result in penalties and automatic re-storage.",
    details: "Proof-of-Retrievability challenges use random nonces to ensure data integrity over time.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">How Glacier Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            A step-by-step look at how your files are securely stored across the decentralized network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <GlowCard key={index} glowColor="deep" customSize={true} className="p-6 h-72">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
              </div>
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-muted-foreground">{step.description}</p>
                <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  <strong>Technical Detail:</strong> {step.details}
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  )
}
