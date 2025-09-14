import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-balance">Ready to Experience Trustless Storage?</h2>
        <p className="text-xl mb-12 text-gray-300 text-pretty max-w-2xl mx-auto">
          Join the decentralized storage revolution. Store your files securely or earn passive income by providing
          storage.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/upload">
            <Button
              size="lg"
              className="text-lg px-8 py-4 h-auto bg-white text-black hover:bg-gray-100 hover:text-black hover:scale-105 hover:shadow-lg hover:shadow-white/25 transition-all duration-300 delay-75"
            >
              Upload Your First File
            </Button>
          </Link>
          <Link href="/provider">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 h-auto border-2 border-white/30 text-white bg-transparent hover:bg-white hover:text-black hover:border-white hover:scale-105 hover:shadow-lg hover:shadow-white/25 transition-all duration-300 delay-75"
            >
              Start Earning as a Provider
            </Button>
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-white/20">
          <p className="text-sm text-gray-400">Built on Avalanche • Open Source • Community Driven</p>
        </div>
      </div>
    </section>
  )
}
