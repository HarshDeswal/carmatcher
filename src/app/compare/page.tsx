import { getSearchResults } from "@/actions/search";
import { ComparisonTable } from "@/components/cars/ComparisonTable";
import { LinkButton } from "@/components/ui/Button";
import { formatLabel, formatPrice } from "@/lib/types";
import Image from "next/image";

export const metadata = {
  title: "Compare Cars — AI Car Matchmaker",
};

interface ComparePageProps {
  searchParams: Promise<{ searchId?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const searchId = params.searchId;

  if (!searchId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Nothing to compare</h1>
        <p className="mt-4 text-gray-600">
          Complete a search first to compare your top recommendations.
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
        <div className="mt-8">
          <LinkButton href="/questionnaire">Start New Search</LinkButton>
        </div>
      </div>
    );
  }

  const { search, recommendations } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Compare Your Top Matches
          </h1>
          <p className="mt-2 text-gray-600">
            Budget: {formatPrice(search.budget)} · Priority:{" "}
            {formatLabel(search.priority)}
          </p>
        </div>
        <LinkButton href={`/results?searchId=${searchId}`} variant="outline" size="sm">
          Back to Results
        </LinkButton>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-3">
        {recommendations.map((rec) => (
          <div
            key={rec.car.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={rec.car.imageUrl}
                alt={`${rec.car.brand} ${rec.car.model}`}
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
            <div className="p-4 text-center">
              <div className="text-sm text-brand-600">{rec.car.brand}</div>
              <h3 className="font-bold text-gray-900">
                {rec.car.model} {rec.car.variant}
              </h3>
              <div className="mt-2 text-2xl font-bold text-brand-600">
                {Math.round(rec.score * 100)}%
              </div>
              <div className="text-xs text-gray-500">Match Score</div>
            </div>
          </div>
        ))}
      </div>

      <ComparisonTable recommendations={recommendations} />
    </div>
  );
}
