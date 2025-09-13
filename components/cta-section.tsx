import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-balance">Ready to Experience Trustless Storage?</h2>
        <p className="text-xl mb-12 text-primary-foreground/90 text-pretty max-w-2xl mx-auto">
          Join the decentralized storage revolution. Store your files securely or earn passive income by providing
          storage.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/upload">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 h-auto">
              Upload Your First File
            </Button>
          </Link>
          <Link href="/provider">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 h-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              Start Earning as Provider
            </Button>
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/20">
          <p className="text-sm text-primary-foreground/70">Built on Avalanche • Open Source • Community Driven</p>
        </div>
      </div>
    </section>
  )
}
