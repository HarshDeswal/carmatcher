import { LinkButton } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-100 backdrop-blur">
              Smart car recommendations for India
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Perfect Car Match
            </h1>
            <p className="mt-6 text-lg leading-8 text-brand-100 sm:text-xl">
              Answer 7 simple questions about your budget, preferences, and
              lifestyle. Our AI-powered matchmaker analyzes 60+ Indian cars to
              recommend your top 3 perfect matches.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <LinkButton href="/questionnaire" size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Start Questionnaire
              </LinkButton>
              <LinkButton href="/history" size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Past Searches
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to your ideal car
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <StepCard
              step={1}
              title="Tell Us Your Preferences"
              description="Share your budget, fuel type, body style, family size, and what matters most to you."
            />
            <StepCard
              step={2}
              title="Smart Matching Engine"
              description="Our weighted algorithm scores 60+ cars on budget, safety, mileage, and your priorities."
            />
            <StepCard
              step={3}
              title="Compare & Decide"
              description="Review your top 3 matches with detailed pros, cons, scores, and side-by-side comparison."
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-bold text-white">
              Ready to find your car?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100">
              Join thousands of smart buyers who use data-driven recommendations
              instead of guesswork.
            </p>
            <div className="mt-8">
              <LinkButton
                href="/questionnaire"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Get Started — It&apos;s Free
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
        {step}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {description}
      </p>
    </div>
  );
}
