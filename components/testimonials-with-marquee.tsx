import { cn } from "@/lib/utils"
import { GlowCard } from "@/components/spotlight-card"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({
  title,
  description,
  testimonials,
  className
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "bg-black text-white",
      "py-12 sm:py-24 md:py-32 px-0",
      className
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight text-white">
            {title}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-gray-300 sm:text-xl">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] flex-row [--duration:80s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {/* First complete set */}
              {testimonials.map((testimonial, i) => (
                <GlowCard
                  key={`first-${i}`}
                  glowColor="arctic"
                  customSize={true}
                  className="w-80 h-64 p-6 hover:scale-105 transition-transform duration-300 flex-shrink-0"
                >
                  <TestimonialCard
                    author={testimonial.author}
                    text={testimonial.text}
                    href={testimonial.href}
                    className="h-full border-0 bg-transparent text-white"
                  />
                </GlowCard>
              ))}
              {/* Second complete set for seamless loop */}
              {testimonials.map((testimonial, i) => (
                <GlowCard
                  key={`second-${i}`}
                  glowColor="arctic"
                  customSize={true}
                  className="w-80 h-64 p-6 hover:scale-105 transition-transform duration-300 flex-shrink-0"
                >
                  <TestimonialCard
                    author={testimonial.author}
                    text={testimonial.text}
                    href={testimonial.href}
                    className="h-full border-0 bg-transparent text-white"
                  />
                </GlowCard>
              ))}
              {/* Third complete set for seamless loop */}
              {testimonials.map((testimonial, i) => (
                <GlowCard
                  key={`third-${i}`}
                  glowColor="arctic"
                  customSize={true}
                  className="w-80 h-64 p-6 hover:scale-105 transition-transform duration-300 flex-shrink-0"
                >
                  <TestimonialCard
                    author={testimonial.author}
                    text={testimonial.text}
                    href={testimonial.href}
                    className="h-full border-0 bg-transparent text-white"
                  />
                </GlowCard>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-black sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-black sm:block" />
        </div>
      </div>
    </section>
  )
}