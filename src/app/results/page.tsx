import { getSearchResults } from "@/actions/search";
import { CarCard } from "@/components/cars/CarCard";
import { ComparisonTable } from "@/components/cars/ComparisonTable";
import { LinkButton } from "@/components/ui/Button";
import { formatLabel, formatPrice } from "@/lib/types";
import Link from "next/link";

export const metadata = {
  title: "Your Recommendations — AI Car Matchmaker",
};

interface ResultsPageProps {
  searchParams: Promise<{ searchId?: string }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const searchId = params.searchId;

  if (!searchId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">No search found</h1>
        <p className="mt-4 text-gray-600">
          Please complete the questionnaire to get recommendations.
        </p>
        <div className="mt-8">
          <LinkButton href="/questionnaire">Take Questionnaire</LinkButton>
        </div>
      </div>
    );
  }

  const data = await getSearchResults(searchId);

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Search not found</h1>
        <p className="mt-4 text-gray-600">
          This search may have expired or does not exist.
        </p>
        <div className="mt-8">
          <LinkButton href="/questionnaire">Start New Search</LinkButton>
        </div>
      </div>
    );
  }

  const { search, recommendations } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Top 3 Car Matches
            </h1>
            <p className="mt-2 text-gray-600">
              Based on your preferences — sorted by match score
            </p>
          </div>
          <div className="flex gap-3">
            <LinkButton href="/questionnaire" variant="outline" size="sm">
              New Search
            </LinkButton>
            <Link
              href={`/compare?searchId=${searchId}`}
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Full Comparison
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <PreferenceTag label="Budget" value={formatPrice(search.budget)} />
          <PreferenceTag label="Fuel" value={formatLabel(search.fuelType)} />
          <PreferenceTag label="Transmission" value={formatLabel(search.transmission)} />
          <PreferenceTag label="Body" value={formatLabel(search.bodyType)} />
          <PreferenceTag label="Family" value={`${search.familySize} people`} />
          <PreferenceTag label="Usage" value={formatLabel(search.primaryUsage)} />
          <PreferenceTag label="Priority" value={formatLabel(search.priority)} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {recommendations.map((rec, index) => (
          <CarCard key={rec.car.id} recommendation={rec} rank={index + 1} />
        ))}
      </div>

      <div className="mt-16">
        <ComparisonTable recommendations={recommendations} />
      </div>
    </div>
  );
}

function PreferenceTag({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      <span className="text-gray-500">{label}:</span>
      <span className="ml-1">{value}</span>
    </span>
  );
}
