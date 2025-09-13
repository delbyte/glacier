import { Button } from "@/components/ui/button"
import { Component as RaycastAnimatedBackground } from "@/components/raycast-animated-blue-background"
import { Mountain, Infinity, Network, MessageCircle, Globe } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 will-change-transform">
        <RaycastAnimatedBackground />
      </div>

      {/* Header with Logo */}
      <header className="relative z-20 p-6">
        <div className="flex items-center space-x-3">
          <Mountain className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Glacier</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-8">

          {/* Main Heading */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-balance leading-tight">
            Decentralized Storage
            <span className="block text-primary">Built on Avalanche</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-300 text-pretty max-w-3xl mx-auto leading-relaxed">
            Store your files securely across a distributed network. Earn passive income by providing storage. Powered by
            Avalanche blockchain with cryptographic proofs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/upload">
              <Button
                size="lg"
                className="text-lg px-8 py-4 h-auto font-semibold bg-white text-black hover:bg-gray-100 hover:scale-105 hover:shadow-lg hover:shadow-white/25 transition-all duration-300 delay-75"
              >
                Start Storing Files
              </Button>
            </Link>
            <Link href="/provider">
              <Button
                size="lg"
                className="text-lg px-8 py-4 h-auto font-semibold bg-white/10 border-2 border-white/30 text-white hover:bg-white hover:text-black hover:border-white hover:scale-105 hover:shadow-lg hover:shadow-white/25 transition-all duration-300 delay-75 backdrop-blur-sm"
              >
                Become a Provider
              </Button>
            </Link>
          </div>

          {/* Additional Navigation */}
          <div className="flex flex-wrap gap-3 justify-center items-center pt-6">
            <a href="#testimonials" className="inline-block">
              <Button
                size="sm"
                className="text-sm px-4 py-2 h-auto bg-white/10 border-2 border-white/30 text-white hover:bg-white hover:text-black hover:border-white hover:scale-105 hover:shadow-lg hover:shadow-white/25 transition-all duration-300 delay-75 backdrop-blur-sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Testimonials
              </Button>
            </a>
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
              <div className="text-3xl font-bold text-primary flex items-center justify-center">
                <Infinity className="w-8 h-8" />
              </div>
              <div className="text-sm text-gray-400">Scalability</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
