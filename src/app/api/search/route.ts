import { NextRequest, NextResponse } from "next/server";
import { searchCars } from "@/actions/search";
import { SearchPreferences } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const preferences: SearchPreferences = {
      budget: Number(body.budget),
      fuelType: body.fuelType,
      transmission: body.transmission,
      bodyType: body.bodyType,
      familySize: Number(body.familySize),
      primaryUsage: body.primaryUsage,
      priority: body.priority,
    };

    const result = await searchCars(preferences);

    return NextResponse.json({
      searchId: result.searchId,
      recommendations: result.recommendations.map((r) => ({
        ...r,
        score: Math.round(r.score * 100),
      })),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to process search" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchId = request.nextUrl.searchParams.get("searchId");

  if (!searchId) {
    return NextResponse.json({ error: "searchId required" }, { status: 400 });
  }

  const { getSearchResults } = await import("@/actions/search");
  const data = await getSearchResults(searchId);

  if (!data) {
    return NextResponse.json({ error: "Search not found" }, { status: 404 });
  }

  return NextResponse.json({
    search: data.search,
    recommendations: data.recommendations.map((r) => ({
      ...r,
      score: Math.round(r.score * 100),
    })),
  });
}
