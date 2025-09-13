import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function BenefitsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Built for Everyone</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Whether you need secure storage or want to earn passive income, Glacier has you covered
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* For Renters */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center pb-8">
              <div className="text-6xl mb-4">📁</div>
              <CardTitle className="text-2xl text-primary">For File Storage</CardTitle>
              <CardDescription className="text-lg">Secure, private, censorship-resistant storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Complete Privacy</h4>
                    <p className="text-sm text-muted-foreground">Files encrypted client-side with your password</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Censorship Resistant</h4>
                    <p className="text-sm text-muted-foreground">No central authority can block your files</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Guaranteed Availability</h4>
                    <p className="text-sm text-muted-foreground">Smart contracts ensure your data stays accessible</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Cost Effective</h4>
                    <p className="text-sm text-muted-foreground">Competitive pricing through market dynamics</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* For Providers */}
          <Card className="border-2 border-accent/20">
            <CardHeader className="text-center pb-8">
              <div className="text-6xl mb-4">💰</div>
              <CardTitle className="text-2xl text-accent">For Storage Providers</CardTitle>
              <CardDescription className="text-lg">Monetize your unused hard drive space</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Passive Income</h4>
                    <p className="text-sm text-muted-foreground">Earn $GLCR tokens for providing storage</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Automated Payments</h4>
                    <p className="text-sm text-muted-foreground">Smart contracts handle all transactions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Low Barrier to Entry</h4>
                    <p className="text-sm text-muted-foreground">Just run our node software and stake collateral</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Global Network</h4>
                    <p className="text-sm text-muted-foreground">Join providers worldwide in the storage economy</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
