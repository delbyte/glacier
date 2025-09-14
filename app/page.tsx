"use client"

import { HeroSection } from "@/components/hero-section"
import { AnimatedSection } from "@/components/animated-section"
import { Suspense, lazy } from "react"
import { motion } from "framer-motion"

// Lazy load heavy components
const FeaturesSection = lazy(() => import("@/components/features-section").then(m => ({ default: m.FeaturesSection })))
const HowItWorksSection = lazy(() => import("@/components/how-it-works-section").then(m => ({ default: m.HowItWorksSection })))
const BenefitsSection = lazy(() => import("@/components/benefits-section").then(m => ({ default: m.BenefitsSection })))
const TestimonialsSection = lazy(() => import("@/components/testimonials-section").then(m => ({ default: m.TestimonialsSection })))
const CTASection = lazy(() => import("@/components/cta-section").then(m => ({ default: m.CTASection })))
const Footer = lazy(() => import("@/components/footer").then(m => ({ default: m.Footer })))

// Lightweight loading fallback
const SectionSkeleton = ({ height = "400px" }: { height?: string }) => (
  <div className="w-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={{ height }}>
    <div className="container mx-auto px-4 h-full flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  </div>
)

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero loads immediately - it's above the fold */}
      <AnimatedSection rootMargin="10% 0px">
        <HeroSection />
      </AnimatedSection>
      
      {/* Lazy load everything else with smart animation control */}
      <Suspense fallback={<SectionSkeleton height="600px" />}>
        <AnimatedSection delay={0.1}>
          <FeaturesSection />
        </AnimatedSection>
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <AnimatedSection delay={0.2}>
          <HowItWorksSection />
        </AnimatedSection>
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <AnimatedSection delay={0.3}>
          <BenefitsSection />
        </AnimatedSection>
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <AnimatedSection id="testimonials" delay={0.4}>
          <TestimonialsSection />
        </AnimatedSection>
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="300px" />}>
        <AnimatedSection delay={0.5}>
          <CTASection />
        </AnimatedSection>
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="200px" />}>
        <AnimatedSection delay={0.6}>
          <Footer />
        </AnimatedSection>
      </Suspense>
    </main>
  )
}
