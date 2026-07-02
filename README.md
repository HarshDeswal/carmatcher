<img width="1891" height="857" alt="image" src="https://github.com/user-attachments/assets/dcce1c42-61a6-4109-b319-10750c0f5cff" />


https://carmatcher.vercel.app/

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
- A [Neon](https://neon.tech) PostgreSQL database

### Setup

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Set `DATABASE_URL` to your Neon connection string:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
   ```

   Use the **pooled** connection string from the Neon dashboard for serverless/Vercel deployments.

3. **Create schema, run migrations, and seed**

   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

   Or in one step:

   ```bash
   npm run db:setup
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Database Commands

| Command | Description |
|---------|-------------|
| `npx prisma migrate deploy` | Apply migrations to Neon (production/CI) |
| `npm run db:migrate` | Create & apply migrations locally (`prisma migrate dev`) |
| `npm run db:deploy` | Alias for `prisma migrate deploy` |
| `npm run db:seed` | Seed 61 cars from `data/cars.json` |
| `npm run db:setup` | `migrate deploy` + seed |

### Fresh database setup

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run build
```

## Project Structure

```
├── data/
│   └── cars.json          # 61 Indian car seed data
├── prisma/
│   ├── schema.prisma      # Car & SearchHistory models
│   ├── seed.ts            # Seed script
│   └── migrations/        # PostgreSQL migrations
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

### 1. Create a Neon database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the **pooled** connection string (recommended for serverless)

### 2. Push to GitHub

```bash
git add .
git commit -m "Migrate to Neon PostgreSQL"
git push origin main
```

### 3. Import project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)

### 4. Set environment variable

In **Project Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon **pooled** connection string |

Apply to **Production**, **Preview**, and **Development**.

### 5. Configure build (first deploy only)

Run migrations and seed **once** before or during the first deploy. Options:

**Option A — Run locally against Neon (recommended for first deploy):**

```bash
DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
DATABASE_URL="your-neon-connection-string" npm run db:seed
```

Then deploy normally. Vercel build command stays the default:

```
npm run build
```

**Option B — Include migrate + seed in Vercel build command (first deploy):**

Set **Build Command** to:

```
npx prisma migrate deploy && npm run db:seed && npm run build
```

After the first successful deploy, revert the build command to `npm run build` so seed does not re-run on every deploy.

### 6. Deploy

Click **Deploy**. The app uses only `DATABASE_URL` — no other secrets required.

### Environment variable summary

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client + production build |
| `npm run db:migrate` | Dev migrations (`prisma migrate dev`) |
| `npm run db:deploy` | Production migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Seed cars from JSON |
| `npm run db:setup` | Deploy migrations + seed |

## License

MIT
