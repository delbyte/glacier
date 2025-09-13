"use client"

import { HeroSection } from "@/components/hero-section"
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
      <HeroSection />
      
      {/* Lazy load everything else */}
      <Suspense fallback={<SectionSkeleton height="600px" />}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 0.3 }}
        >
          <FeaturesSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 0.3 }}
        >
          <HowItWorksSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="400px" />}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 0.3 }}
        >
          <BenefitsSection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="500px" />}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 0.3 }}
        >
          <section id="testimonials">
            <TestimonialsSection />
          </section>
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="300px" />}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 0.3 }}
        >
          <CTASection />
        </motion.div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="200px" />}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "50px" }}
          transition={{ duration: 0.3 }}
        >
          <Footer />
        </motion.div>
      </Suspense>
    </main>
  )
}
