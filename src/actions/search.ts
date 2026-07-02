"use server";

import { prisma } from "@/lib/prisma";
import { recommendCars } from "@/lib/recommendation";
import {
  SearchPreferences,
  StoredSearchResult,
  CarRecord,
  RecommendationResult,
} from "@/lib/types";
import { redirect } from "next/navigation";

function toCarRecord(car: {
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
}): CarRecord {
  return {
    id: car.id,
    brand: car.brand,
    model: car.model,
    variant: car.variant,
    price: car.price,
    mileage: car.mileage,
    fuelType: car.fuelType,
    transmission: car.transmission,
    bodyType: car.bodyType,
    safetyRating: car.safetyRating,
    performanceScore: car.performanceScore,
    comfortScore: car.comfortScore,
    seatingCapacity: car.seatingCapacity,
    imageUrl: car.imageUrl,
    pros: car.pros,
    cons: car.cons,
  };
}

export async function searchCars(
  preferences: SearchPreferences
): Promise<{ searchId: string; recommendations: RecommendationResult[] }> {
  const cars = await prisma.car.findMany();
  const carRecords = cars.map(toCarRecord);
  const recommendations = recommendCars(carRecords, preferences);

  const storedResults: StoredSearchResult[] = recommendations.map((r) => ({
    carId: r.car.id,
    score: r.score,
    reason: r.reason,
    breakdown: r.breakdown,
  }));

  const search = await prisma.searchHistory.create({
    data: {
      budget: preferences.budget,
      fuelType: preferences.fuelType,
      transmission: preferences.transmission,
      bodyType: preferences.bodyType,
      familySize: preferences.familySize,
      primaryUsage: preferences.primaryUsage,
      priority: preferences.priority,
      results: JSON.stringify(storedResults),
    },
  });

  return { searchId: search.id, recommendations };
}

export async function submitQuestionnaire(formData: FormData) {
  const budget = Number(formData.get("budget"));
  const fuelType = formData.get("fuelType") as SearchPreferences["fuelType"];
  const transmission = formData.get("transmission") as SearchPreferences["transmission"];
  const bodyType = formData.get("bodyType") as SearchPreferences["bodyType"];
  const familySize = Number(formData.get("familySize"));
  const primaryUsage = formData.get("primaryUsage") as SearchPreferences["primaryUsage"];
  const priority = formData.get("priority") as SearchPreferences["priority"];

  const preferences: SearchPreferences = {
    budget,
    fuelType,
    transmission,
    bodyType,
    familySize,
    primaryUsage,
    priority,
  };

  const { searchId } = await searchCars(preferences);
  redirect(`/results?searchId=${searchId}`);
}

export async function getSearchResults(searchId: string) {
  const search = await prisma.searchHistory.findUnique({
    where: { id: searchId },
  });

  if (!search) return null;

  const storedResults: StoredSearchResult[] = JSON.parse(search.results);
  const carIds = storedResults.map((r) => r.carId);

  const cars = await prisma.car.findMany({
    where: { id: { in: carIds } },
  });

  const carMap = new Map(cars.map((c) => [c.id, toCarRecord(c)]));

  const recommendations: RecommendationResult[] = storedResults
    .map((stored) => {
      const car = carMap.get(stored.carId);
      if (!car) return null;
      return {
        car,
        score: stored.score,
        reason: stored.reason,
        breakdown: stored.breakdown,
      };
    })
    .filter((r): r is RecommendationResult => r !== null);

  return {
    search: {
      id: search.id,
      budget: search.budget,
      fuelType: search.fuelType,
      transmission: search.transmission,
      bodyType: search.bodyType,
      familySize: search.familySize,
      primaryUsage: search.primaryUsage,
      priority: search.priority,
      results: storedResults,
      createdAt: search.createdAt,
    },
    recommendations,
  };
}

export async function getSearchHistory() {
  const searches = await prisma.searchHistory.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return searches.map((search) => {
    const storedResults: StoredSearchResult[] = JSON.parse(search.results);
    return {
      id: search.id,
      budget: search.budget,
      fuelType: search.fuelType,
      transmission: search.transmission,
      bodyType: search.bodyType,
      familySize: search.familySize,
      primaryUsage: search.primaryUsage,
      priority: search.priority,
      topScore: storedResults[0]?.score ?? 0,
      resultCount: storedResults.length,
      createdAt: search.createdAt,
    };
  });
}

export async function getCarsByIds(ids: string[]): Promise<CarRecord[]> {
  const cars = await prisma.car.findMany({
    where: { id: { in: ids } },
  });
  return cars.map(toCarRecord);
}
