import { getSearchHistory } from "@/actions/search";
import { LinkButton } from "@/components/ui/Button";
import { formatLabel, formatPrice } from "@/lib/types";
import Link from "next/link";

export const metadata = {
  title: "Search History — AI Car Matchmaker",
};

export default async function HistoryPage() {
  const history = await getSearchHistory();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search History</h1>
          <p className="mt-2 text-gray-600">
            Review your previous car match searches
          </p>
        </div>
        <LinkButton href="/questionnaire" size="sm">
          New Search
        </LinkButton>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No searches yet
          </h2>
          <p className="mt-2 text-gray-600">
            Complete the questionnaire to see your search history here.
          </p>
          <div className="mt-6">
            <LinkButton href="/questionnaire">Start Questionnaire</LinkButton>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <Link
              key={entry.id}
              href={`/results?searchId=${entry.id}`}
              className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Tag>{formatPrice(entry.budget)}</Tag>
                    <Tag>{formatLabel(entry.fuelType)}</Tag>
                    <Tag>{formatLabel(entry.bodyType)}</Tag>
                    <Tag>{formatLabel(entry.priority)} priority</Tag>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-brand-600">
                      {Math.round(entry.topScore * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Top match · {entry.resultCount} cars
                    </div>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}
