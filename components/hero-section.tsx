import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "@/components/animated-background"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">🏔️</span>
            </div>
            <h1 className="text-4xl font-bold text-white">Glacier</h1>
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-balance leading-tight">
            Decentralized Storage
            <span className="block text-primary">Built for Web3</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-300 text-pretty max-w-3xl mx-auto leading-relaxed">
            Store your files securely across a distributed network. Earn passive income by providing storage. Powered by
            Avalanche blockchain with cryptographic proofs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/upload">
              <Button size="lg" className="text-lg px-8 py-4 h-auto">
                Start Storing Files
              </Button>
            </Link>
            <Link href="/provider">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 h-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Become a Provider
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-gray-400">Trustless</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-gray-400">Central Authority</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-sm text-gray-400">Scalability</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
