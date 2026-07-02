# AI Car Matchmaker

A Next.js app that helps users decide which car to buy based on their preferences. Answer a short questionnaire and get personalized recommendations from 60+ realistic Indian cars.

## What did you build and why?

I built **AI Car Matchmaker**, a full-stack web application that helps a confused car buyer narrow down their options into a confident shortlist.

Instead of exposing users to a long list of cars and filters, the application asks a short questionnaire covering budget, fuel preference, transmission, body type, family size, primary usage, and buying priority. Based on these inputs, the backend computes a weighted recommendation score across a curated dataset of Indian cars and returns the three best matches with an explanation and comparison table.

The goal was to optimize for the core user journey:
**"I don't know what to buy" → "Here are the three cars that best match my needs."**

### What I deliberately cut

Given the 2–3 hour time constraint, I intentionally kept the scope focused and omitted:

- User authentication and profiles
- Live automotive APIs or constantly updated datasets
- Advanced filtering and sorting
- AI-generated natural language explanations (used deterministic explanations instead)
- Wishlist, favorites, and notifications
- Rich analytics and dashboards

I prioritized delivering a complete end-to-end recommendation flow over implementing many partially finished features.

## Tech Stack

- **Next.js 15 (App Router)** — Unified frontend and backend in a single framework with Server Actions, reducing boilerplate and enabling faster iteration.
- **TypeScript** — Improved type safety and maintainability with minimal overhead.
- **Tailwind CSS** — Rapid UI development without writing custom CSS.
- **Prisma ORM** — Simple database access with a strongly typed client.
- **SQLite** — Lightweight database suitable for rapid prototyping within the assignment time limit.
- **Server Actions** — Simplified communication between frontend and backend without creating unnecessary REST endpoints.

The overall stack was selected to maximize development speed while maintaining a clean architecture and readable codebase.

## AI Usage

I intentionally used AI as an implementation accelerator rather than as an autopilot.

### Delegated to AI

- Initial project scaffolding
- Component boilerplate
- Form generation
- Prisma model scaffolding
- Tailwind UI generation
- Basic CRUD operations
- Initial README draft
- Seed data generation for the car dataset

### Implemented / Reviewed Manually

- Product scope and feature prioritization
- Recommendation scoring logic
- Overall application architecture
- Code review and refinement of generated code
- Integration between frontend, backend, and recommendation engine
- Debugging runtime and deployment issues
- Final testing and validation

### Where AI helped most

AI significantly reduced the time spent writing repetitive boilerplate, allowing me to focus on product decisions and integration instead of routine implementation.

## Where AI got in the way

The biggest challenge was deployment.

The generated project used Prisma with SQLite, which worked well for local development but required additional changes for deployment on serverless platforms because local SQLite files are not suitable for production environments like Vercel.

AI generated a solid starting point but still required manual verification, debugging, and engineering judgment during integration and deployment.

This reinforced that while AI is excellent for accelerating implementation, deployment decisions, infrastructure choices, and final validation still require human oversight.

## If I had another 4 hours

I would focus on improving the product rather than adding unrelated features.

Planned improvements include:

- Migrate to a production-ready hosted database (Neon PostgreSQL or Turso).
- Integrate an LLM to generate personalized recommendation explanations instead of template-based reasoning.
- Add richer comparison visualizations (ownership cost, maintenance, resale value, fuel cost estimates).
- Introduce advanced recommendation filters and confidence scoring.
- Improve mobile responsiveness and accessibility.
- Add unit tests for the recommendation engine and end-to-end testing for the questionnaire flow.
- Support dynamic datasets from external automotive APIs instead of a static JSON dataset.

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
