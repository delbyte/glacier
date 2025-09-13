import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-sidebar border-t border-sidebar-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-sidebar-primary-foreground">🏔️</span>
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">Glacier</span>
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              Decentralized storage network built on Avalanche blockchain.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sidebar-foreground">Product</h3>
            <div className="space-y-2">
              <Link href="/upload" className="block text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
                Upload Files
              </Link>
              <Link href="/provider" className="block text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
                Become Provider
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sidebar-foreground">Resources</h3>
            <div className="space-y-2">
              <Link href="/docs" className="block text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
                Documentation
              </Link>
              <Link
                href="/whitepaper"
                className="block text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground"
              >
                Whitepaper
              </Link>
              <Link href="/api" className="block text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
                API Reference
              </Link>
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sidebar-foreground">Community</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
                Discord
              </a>
              <a href="#" className="block text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
                Twitter
              </a>
              <a href="#" className="block text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sidebar-border">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-sidebar-foreground/70">© 2024 Glacier. Built for the decentralized future.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link href="/privacy" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
