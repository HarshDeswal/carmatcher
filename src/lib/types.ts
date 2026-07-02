export type FuelType = "petrol" | "diesel" | "cng" | "electric" | "hybrid";
export type Transmission = "manual" | "automatic";
export type BodyType = "hatchback" | "sedan" | "suv" | "muv" | "coupe";
export type PrimaryUsage = "city" | "highway" | "mixed";
export type Priority = "mileage" | "safety" | "performance" | "comfort";

export interface SearchPreferences {
  budget: number;
  fuelType: FuelType;
  transmission: Transmission;
  bodyType: BodyType;
  familySize: number;
  primaryUsage: PrimaryUsage;
  priority: Priority;
}

export interface CarRecord {
  id: string;
  brand: string;
  model: string;
  variant: string;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  safetyRating: number;
  performanceScore: number;
  comfortScore: number;
  seatingCapacity: number;
  imageUrl: string;
  pros: string;
  cons: string;
}

export interface RecommendationResult {
  car: CarRecord;
  score: number;
  reason: string;
  breakdown: {
    budget: number;
    bodyType: number;
    fuel: number;
    transmission: number;
    safety: number;
    mileage: number;
  };
}

export interface StoredSearchResult {
  carId: string;
  score: number;
  reason: string;
  breakdown: RecommendationResult["breakdown"];
}

export interface SearchHistoryEntry {
  id: string;
  budget: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  familySize: number;
  primaryUsage: string;
  priority: string;
  results: StoredSearchResult[];
  createdAt: Date;
}

export const FUEL_TYPES: { value: FuelType; label: string }[] = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "cng", label: "CNG" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];

export const TRANSMISSIONS: { value: Transmission; label: string }[] = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
];

export const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: "hatchback", label: "Hatchback" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "muv", label: "MUV" },
  { value: "coupe", label: "Coupe" },
];

export const PRIMARY_USAGES: { value: PrimaryUsage; label: string }[] = [
  { value: "city", label: "City Driving" },
  { value: "highway", label: "Highway Driving" },
  { value: "mixed", label: "Mixed Usage" },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "mileage", label: "Mileage" },
  { value: "safety", label: "Safety" },
  { value: "performance", label: "Performance" },
  { value: "comfort", label: "Comfort" },
];

export const WEIGHTS = {
  budget: 0.4,
  bodyType: 0.2,
  fuel: 0.15,
  transmission: 0.1,
  safety: 0.1,
  mileage: 0.05,
} as const;

export function formatPrice(price: number): string {
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lakh`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function parseProsCons(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
