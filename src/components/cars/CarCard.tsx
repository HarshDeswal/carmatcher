import Image from "next/image";
import {
  RecommendationResult,
  formatPrice,
  parseProsCons,
} from "@/lib/types";

interface CarCardProps {
  recommendation: RecommendationResult;
  rank: number;
}

export function CarCard({ recommendation, rank }: CarCardProps) {
  const { car, score, reason } = recommendation;
  const pros = parseProsCons(car.pros);
  const cons = parseProsCons(car.cons);
  const mileageUnit = car.fuelType === "electric" ? "km/charge" : "kmpl";
  const scorePercent = Math.round(score * 100);

  const rankColors = {
    1: "bg-amber-400 text-amber-900",
    2: "bg-gray-300 text-gray-800",
    3: "bg-amber-700 text-amber-100",
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/10] w-full bg-gray-100">
        <Image
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div
          className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${rankColors[rank as 1 | 2 | 3]}`}
        >
          #{rank}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white">
          {scorePercent}% Match
        </div>
      </div>

      <div className="p-6">
        <div className="mb-1 text-sm font-medium text-brand-600">{car.brand}</div>
        <h3 className="text-xl font-bold text-gray-900">
          {car.model} {car.variant}
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Price" value={formatPrice(car.price)} />
          <Stat
            label="Mileage"
            value={`${car.mileage} ${mileageUnit}`}
          />
          <Stat label="Safety" value={`${car.safetyRating}★`} />
          <Stat
            label="Seats"
            value={String(car.seatingCapacity)}
          />
        </div>

        <div className="mt-4 rounded-lg bg-brand-50 p-4">
          <p className="text-sm leading-relaxed text-brand-900">{reason}</p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-green-700">Pros</h4>
            <ul className="space-y-1">
              {pros.map((pro) => (
                <li
                  key={pro}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="mt-1 text-green-500">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-red-700">Cons</h4>
            <ul className="space-y-1">
              {cons.map((con) => (
                <li
                  key={con}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="mt-1 text-red-500">✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}
