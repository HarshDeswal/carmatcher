import { readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CarSeedData {
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
  pros: string[];
  cons: string[];
}

async function main() {
  const filePath = join(process.cwd(), "data", "cars.json");
  const raw = readFileSync(filePath, "utf-8");
  const cars: CarSeedData[] = JSON.parse(raw);

  console.log(`Seeding ${cars.length} cars...`);

  await prisma.searchHistory.deleteMany();
  await prisma.car.deleteMany();

  for (const car of cars) {
    await prisma.car.create({
      data: {
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
        pros: JSON.stringify(car.pros),
        cons: JSON.stringify(car.cons),
      },
    });
  }

  console.log(`Successfully seeded ${cars.length} cars.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
