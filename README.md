# AI Car Matchmaker

A Next.js app that helps users decide which car to buy based on their preferences. Answer a short questionnaire and get personalized recommendations from 60+ realistic Indian cars.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Prisma** + **SQLite**
- Server Actions & API Routes
- No authentication
- Deployable to Vercel

## Features

- **Landing page** with hero and CTA
- **Questionnaire** collecting budget, fuel type, transmission, body type, family size, primary usage, and priority
- **Recommendation engine** with weighted scoring (Budget 40%, Body 20%, Fuel 15%, Transmission 10%, Safety 10%, Mileage 5%)
- **Results page** showing top 3 cars with images, specs, pros/cons, match score, and deterministic explanation
- **Comparison table** for side-by-side analysis
- **Search history** persisting every search

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

3. **Run database migration and seed**

   ```bash
   npm run db:setup
   ```

   Or step by step:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── data/
│   └── cars.json          # 60 Indian car seed data
├── prisma/
│   ├── schema.prisma      # Car & SearchHistory models
│   ├── seed.ts            # Seed script
│   └── migrations/        # SQLite migrations
├── src/
│   ├── actions/           # Server actions
│   ├── app/               # App Router pages & API
│   ├── components/        # UI components
│   └── lib/               # Prisma client, types, recommendation engine
├── .env.example
└── README.md
```

## API

### POST `/api/search`

Submit search preferences and get recommendations.

```json
{
  "budget": 1200000,
  "fuelType": "petrol",
  "transmission": "manual",
  "bodyType": "suv",
  "familySize": 5,
  "primaryUsage": "mixed",
  "priority": "mileage"
}
```

### GET `/api/search?searchId=<id>`

Retrieve results for a previous search.

## Recommendation Engine

Cars are scored using weighted matching:

| Factor       | Weight |
|-------------|--------|
| Budget      | 40%    |
| Body Type   | 20%    |
| Fuel        | 15%    |
| Transmission| 10%    |
| Safety      | 10%    |
| Mileage     | 5%     |

Additional bonuses apply for family size fit, primary usage, and user priority. Top 3 cars are returned sorted by score.

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set `DATABASE_URL=file:./dev.db` (or use Turso/other SQLite-compatible provider)
4. Add build command: `prisma generate && prisma migrate deploy && npm run db:seed && next build`

> **Note:** For production on Vercel, consider migrating to a hosted database (e.g., Turso, PlanetScale, or PostgreSQL) since SQLite file storage is ephemeral on serverless platforms.

## Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start development server       |
| `npm run build`   | Production build               |
| `npm run db:migrate` | Run Prisma migrations       |
| `npm run db:seed` | Seed cars from JSON            |
| `npm run db:setup`| Migrate + seed                 |

## License

MIT
