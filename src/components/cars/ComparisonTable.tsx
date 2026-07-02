import {
  RecommendationResult,
  formatPrice,
  formatLabel,
} from "@/lib/types";

interface ComparisonTableProps {
  recommendations: RecommendationResult[];
}

export function ComparisonTable({ recommendations }: ComparisonTableProps) {
  if (recommendations.length === 0) return null;

  const rows: {
    label: string;
    values: (string | number)[];
  }[] = [
    {
      label: "Match Score",
      values: recommendations.map((r) => `${Math.round(r.score * 100)}%`),
    },
    {
      label: "Brand & Model",
      values: recommendations.map(
        (r) => `${r.car.brand} ${r.car.model}`
      ),
    },
    {
      label: "Variant",
      values: recommendations.map((r) => r.car.variant),
    },
    {
      label: "Price",
      values: recommendations.map((r) => formatPrice(r.car.price)),
    },
    {
      label: "Mileage",
      values: recommendations.map((r) => {
        const unit = r.car.fuelType === "electric" ? "km/charge" : "kmpl";
        return `${r.car.mileage} ${unit}`;
      }),
    },
    {
      label: "Fuel Type",
      values: recommendations.map((r) => formatLabel(r.car.fuelType)),
    },
    {
      label: "Transmission",
      values: recommendations.map((r) => formatLabel(r.car.transmission)),
    },
    {
      label: "Body Type",
      values: recommendations.map((r) => formatLabel(r.car.bodyType)),
    },
    {
      label: "Safety Rating",
      values: recommendations.map((r) => `${r.car.safetyRating}★`),
    },
    {
      label: "Performance",
      values: recommendations.map((r) => `${r.car.performanceScore}/10`),
    },
    {
      label: "Comfort",
      values: recommendations.map((r) => `${r.car.comfortScore}/10`),
    },
    {
      label: "Seating",
      values: recommendations.map((r) => `${r.car.seatingCapacity} seats`),
    },
  ];

  const headers = recommendations.map(
    (r, i) => `#${i + 1} ${r.car.model}`
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">
          Side-by-Side Comparison
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Compare your top 3 recommended cars
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 font-semibold text-gray-900">Feature</th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 font-semibold text-gray-900"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.label}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <td className="px-6 py-3 font-medium text-gray-700">
                  {row.label}
                </td>
                {row.values.map((value, i) => (
                  <td key={`${row.label}-${i}`} className="px-6 py-3 text-gray-600">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
