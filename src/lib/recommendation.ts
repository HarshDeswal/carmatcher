import {
  CarRecord,
  Priority,
  PrimaryUsage,
  RecommendationResult,
  SearchPreferences,
  WEIGHTS,
  formatLabel,
  formatPrice,
} from "./types";

const MAX_MILEAGE = 700;
const MAX_SAFETY = 5;

function scoreBudget(carPrice: number, budget: number): number {
  if (carPrice <= budget) {
    const utilization = carPrice / budget;
    return 0.7 + utilization * 0.3;
  }

  const overBudgetRatio = (carPrice - budget) / budget;
  if (overBudgetRatio <= 0.1) return 0.5;
  if (overBudgetRatio <= 0.2) return 0.3;
  if (overBudgetRatio <= 0.3) return 0.15;
  return 0;
}

function scoreExactMatch(carValue: string, prefValue: string): number {
  return carValue.toLowerCase() === prefValue.toLowerCase() ? 1 : 0;
}

function scoreMileage(car: CarRecord, allCars: CarRecord[]): number {
  const maxMileage = Math.max(...allCars.map((c) => c.mileage), MAX_MILEAGE);
  return car.mileage / maxMileage;
}

function scoreSafety(car: CarRecord): number {
  return car.safetyRating / MAX_SAFETY;
}

function scoreFamilySize(car: CarRecord, familySize: number): number {
  if (car.seatingCapacity >= familySize) {
    if (car.seatingCapacity === familySize) return 1;
    if (car.seatingCapacity === familySize + 1) return 0.9;
    return 0.75;
  }
  return Math.max(0, car.seatingCapacity / familySize);
}

function scorePrimaryUsage(
  car: CarRecord,
  usage: PrimaryUsage
): number {
  switch (usage) {
    case "city":
      if (car.bodyType === "hatchback") return 1;
      if (car.mileage >= 20) return 0.85;
      if (car.bodyType === "suv" && car.price < 1500000) return 0.7;
      return 0.5;
    case "highway":
      if (car.performanceScore >= 8) return 1;
      if (car.comfortScore >= 8) return 0.9;
      if (car.bodyType === "sedan" || car.bodyType === "suv") return 0.75;
      return 0.5;
    case "mixed":
      if (car.mileage >= 18 && car.comfortScore >= 7) return 1;
      if (car.bodyType === "suv" || car.bodyType === "sedan") return 0.8;
      return 0.6;
    default:
      return 0.5;
  }
}

function scorePriority(car: CarRecord, priority: Priority): number {
  switch (priority) {
    case "mileage":
      return Math.min(1, car.mileage / 25);
    case "safety":
      return car.safetyRating / MAX_SAFETY;
    case "performance":
      return car.performanceScore / 10;
    case "comfort":
      return car.comfortScore / 10;
    default:
      return 0.5;
  }
}

export function generateRecommendationReason(
  car: CarRecord,
  preferences: SearchPreferences,
  breakdown: RecommendationResult["breakdown"],
  score: number
): string {
  const reasons: string[] = [];

  if (breakdown.budget >= 0.9) {
    reasons.push(
      `fits comfortably within your ${formatPrice(preferences.budget)} budget at ${formatPrice(car.price)}`
    );
  } else if (breakdown.budget >= 0.5) {
    reasons.push(
      `is close to your ${formatPrice(preferences.budget)} budget at ${formatPrice(car.price)}`
    );
  }

  if (breakdown.bodyType >= 1) {
    reasons.push(
      `matches your preferred ${formatLabel(preferences.bodyType)} body style`
    );
  }

  if (breakdown.fuel >= 1) {
    reasons.push(`runs on ${formatLabel(preferences.fuelType)} as you requested`);
  }

  if (breakdown.transmission >= 1) {
    reasons.push(
      `comes with ${formatLabel(preferences.transmission)} transmission`
    );
  }

  if (breakdown.safety >= 0.8) {
    reasons.push(
      `offers strong safety with a ${car.safetyRating}-star rating`
    );
  }

  if (breakdown.mileage >= 0.7) {
    const unit = car.fuelType === "electric" ? "km/charge" : "kmpl";
    reasons.push(`delivers excellent ${car.mileage} ${unit} mileage`);
  }

  switch (preferences.priority) {
    case "mileage":
      if (car.mileage >= 20 || car.fuelType === "electric") {
        reasons.push("aligns with your priority for fuel efficiency");
      }
      break;
    case "safety":
      if (car.safetyRating >= 4) {
        reasons.push("aligns with your priority for safety");
      }
      break;
    case "performance":
      if (car.performanceScore >= 7) {
        reasons.push("aligns with your priority for performance");
      }
      break;
    case "comfort":
      if (car.comfortScore >= 7) {
        reasons.push("aligns with your priority for comfort");
      }
      break;
  }

  if (car.seatingCapacity >= preferences.familySize) {
    reasons.push(
      `seats ${car.seatingCapacity}, suitable for your family of ${preferences.familySize}`
    );
  }

  const usageReasons: Record<PrimaryUsage, string> = {
    city: "works well for city driving with easy maneuverability",
    highway: "is a capable highway cruiser with stable performance",
    mixed: "handles mixed city and highway usage efficiently",
  };
  reasons.push(usageReasons[preferences.primaryUsage]);

  const topReasons = reasons.slice(0, 4);
  const scorePercent = Math.round(score * 100);

  return `The ${car.brand} ${car.model} ${car.variant} scored ${scorePercent}% because it ${topReasons.join(", ")}.`;
}

export function recommendCars(
  cars: CarRecord[],
  preferences: SearchPreferences
): RecommendationResult[] {
  const eligibleCars = cars.filter((car) => {
    const withinBudget = car.price <= preferences.budget * 1.3;
    const fitsFamily = car.seatingCapacity >= preferences.familySize;
    return withinBudget && fitsFamily;
  });

  const pool = eligibleCars.length >= 3 ? eligibleCars : cars;

  const scored = pool.map((car) => {
    const breakdown = {
      budget: scoreBudget(car.price, preferences.budget),
      bodyType: scoreExactMatch(car.bodyType, preferences.bodyType),
      fuel: scoreExactMatch(car.fuelType, preferences.fuelType),
      transmission: scoreExactMatch(car.transmission, preferences.transmission),
      safety: scoreSafety(car),
      mileage: scoreMileage(car, cars),
    };

    const baseScore =
      breakdown.budget * WEIGHTS.budget +
      breakdown.bodyType * WEIGHTS.bodyType +
      breakdown.fuel * WEIGHTS.fuel +
      breakdown.transmission * WEIGHTS.transmission +
      breakdown.safety * WEIGHTS.safety +
      breakdown.mileage * WEIGHTS.mileage;

    const familyBonus = scoreFamilySize(car, preferences.familySize) * 0.03;
    const usageBonus = scorePrimaryUsage(car, preferences.primaryUsage) * 0.03;
    const priorityBonus = scorePriority(car, preferences.priority) * 0.04;

    const score = Math.min(1, baseScore + familyBonus + usageBonus + priorityBonus);

    return {
      car,
      score,
      breakdown,
      reason: "",
    };
  });

  const sorted = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((result) => ({
      ...result,
      reason: generateRecommendationReason(
        result.car,
        preferences,
        result.breakdown,
        result.score
      ),
    }));

  return sorted;
}
