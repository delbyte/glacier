import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"

// Dynamically import sections that are below the fold for better initial load performance
const FeaturesSection = dynamic(() => import("@/components/features-section").then(mod => ({ default: mod.FeaturesSection })), {
  loading: () => <div className="py-24 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto"><div className="animate-pulse bg-gray-800 h-96 rounded-lg"></div></div></div>
})

const HowItWorksSection = dynamic(() => import("@/components/how-it-works-section").then(mod => ({ default: mod.HowItWorksSection })), {
  loading: () => <div className="py-24 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto"><div className="animate-pulse bg-gray-800 h-96 rounded-lg"></div></div></div>
})

const BenefitsSection = dynamic(() => import("@/components/benefits-section").then(mod => ({ default: mod.BenefitsSection })), {
  loading: () => <div className="py-24 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto"><div className="animate-pulse bg-gray-800 h-96 rounded-lg"></div></div></div>
})

const TestimonialsSection = dynamic(() => import("@/components/testimonials-section").then(mod => ({ default: mod.TestimonialsSection })), {
  loading: () => <div className="py-24 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto"><div className="animate-pulse bg-gray-800 h-96 rounded-lg"></div></div></div>
})

const CTASection = dynamic(() => import("@/components/cta-section").then(mod => ({ default: mod.CTASection })), {
  loading: () => <div className="py-24 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto"><div className="animate-pulse bg-gray-800 h-96 rounded-lg"></div></div></div>
})

const Footer = dynamic(() => import("@/components/footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="py-24 px-4 sm:px-6 lg:px-8"><div className="max-w-7xl mx-auto"><div className="animate-pulse bg-gray-800 h-96 rounded-lg"></div></div></div>
})

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      <CTASection />
      <Footer />
    </main>
  )
}
