"use client";

import Link from "next/link";
import { SmartGlobe } from "@/components/smart-globe-feature-section";
import { WorldMap } from "@/components/map";
import { GlowCard } from "@/components/spotlight-card";
import { AnimatedSection } from "@/components/animated-section";

export default function ExplainPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-20">

          {/* Header */}
          <AnimatedSection>
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                What is Decentralized Storage?
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Decentralized storage distributes your files across many nodes, removing single points of failure and enabling cryptographic proofs of storage.
              </p>
            </div>
          </AnimatedSection>

          {/* How it works section */}
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center max-w-4xl mx-auto">
              <GlowCard className="p-8 flex flex-col flex-1 max-h-[160px]" glowColor="ice">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">How it works</h3>
                <p className="text-gray-300 text-base leading-relaxed flex-1">
                  Files are split, encrypted, and distributed across provider nodes. Retrieval is done via content addressing and proofs ensure providers are storing data.
                </p>
              </GlowCard>

              <GlowCard className="p-8 flex flex-col flex-1 max-h-[160px]" glowColor="arctic">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Why it matters</h3>
                <p className="text-gray-300 text-base leading-relaxed flex-1">
                  No central authority, censorship resistance, and economic incentives to keep data available.
                </p>
              </GlowCard>
            </div>
          </AnimatedSection>

          {/* Global Network Visualization */}
          <AnimatedSection>
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Global Network</h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">See how Glacier's network spans the globe with real-time connections</p>
              </div>
              <div className="relative h-[500px] w-full bg-gradient-to-br from-gray-900/80 to-black/90 rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl">
                <SmartGlobe />
              </div>
            </div>
          </AnimatedSection>

          {/* Data Flow Visualization */}
          <AnimatedSection>
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Data Flow</h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">Watch how data moves across our decentralized network in real-time</p>
              </div>
              <div className="relative h-[500px] w-full bg-gradient-to-br from-gray-900/30 to-black/50 rounded-2xl overflow-hidden border border-gray-800/30 shadow-2xl">
                <WorldMap
                  dots={[
                    { start: { lat: 40.7128, lng: -74.0060, label: 'New York' }, end: { lat: 51.5074, lng: -0.1278, label: 'London' } },
                    { start: { lat: 19.4326, lng: -99.1332, label: 'Mexico City' }, end: { lat: 35.6895, lng: 139.6917, label: 'Tokyo' } },
                    { start: { lat: -33.8688, lng: 151.2093, label: 'Sydney' }, end: { lat: 55.7558, lng: 37.6173, label: 'Moscow' } },
                  ]}
                  showLabels={true}
                  animationDuration={3}
                  loop={true}
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Benefits */}
          <AnimatedSection>
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Key Benefits</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <GlowCard className="p-8 text-center flex flex-col min-h-[180px]" glowColor="deep">
                  <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Trustless</h3>
                  <p className="text-gray-300 text-base leading-relaxed flex-1">
                    Cryptographic proofs ensure data integrity without requiring trust in centralized authorities.
                  </p>
                </GlowCard>

                <GlowCard className="p-8 text-center flex flex-col min-h-[180px]" glowColor="frost">
                  <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Censorship Resistant</h3>
                  <p className="text-gray-300 text-base leading-relaxed flex-1">
                    No single point of failure or control makes your data truly decentralized and accessible.
                  </p>
                </GlowCard>

                <GlowCard className="p-8 text-center flex flex-col min-h-[180px]" glowColor="glacier">
                  <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Economically Incentivized</h3>
                  <p className="text-gray-300 text-base leading-relaxed flex-1">
                    Storage providers earn rewards, creating sustainable economic incentives for the network.
                  </p>
                </GlowCard>
              </div>
            </div>
          </AnimatedSection>

          {/* Back button */}
          <AnimatedSection>
            <div className="text-center pt-12">
              <Link href="/" className="inline-block group">
                <button className="px-12 py-5 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border-2 border-white/20 text-white hover:bg-gradient-to-r hover:from-white hover:to-gray-100 hover:text-black transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 font-semibold text-lg backdrop-blur-sm">
                  <span className="flex items-center gap-3">
                    ← Back to Home
                  </span>
                </button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
