# Alien Miniapp Boilerplate

A production-ready boilerplate for building miniapps on the Alien platform with Next.js.

## Features

- **Authentication**: JWT verification with `@alien_org/auth-client`
- **Database**: PostgreSQL with Drizzle ORM and migrations
- **Frontend**: React with `@alien_org/react` SDK integration
- **API**: Next.js API routes with user management

## Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Start the database

```bash
docker compose up -d
```

### 3. Run migrations

```bash
bun run db:migrate
```

### 4. Start development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── me/route.ts     # User info endpoint
│   ├── layout.tsx          # Root layout with AlienProvider
│   ├── page.tsx            # Home page with auth status
│   └── providers.tsx       # Client-side providers
├── lib/
│   ├── auth.ts             # Auth client and utilities
│   └── db/
│       ├── index.ts        # Database connection
│       └── schema.ts       # Drizzle schema (users table)
├── drizzle/                # Generated migrations
└── docker-compose.yml      # Local PostgreSQL
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

## Database Commands

```bash
bun run db:generate   # Generate migration from schema changes
bun run db:migrate    # Apply pending migrations
bun run db:push       # Push schema directly (dev only)
bun run db:studio     # Open Drizzle Studio GUI
```

## API Endpoints

### GET /api/me

Returns the current user's information. Requires Bearer token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "alienId": "user-alien-id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## How Auth Works

1. The Alien app injects an auth token when loading your miniapp
2. The `@alien_org/react` SDK provides the token via `useAlien()` hook
3. Your frontend sends the token to API routes in the Authorization header
4. The API verifies the token using `@alien_org/auth-client` against Alien's JWKS
5. The `sub` claim from the JWT is the user's unique Alien ID

## Development

When running outside the Alien app, the bridge won't be available. The UI shows connection status to help with debugging.

## Deployment

### Vercel (Recommended)

1. Create a PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.)
2. Add `DATABASE_URL` to your Vercel project environment variables
3. Deploy - migrations run automatically during the build step

### Other Platforms

1. Set up a PostgreSQL database
2. Set the `DATABASE_URL` environment variable
3. Run `bun run db:migrate` to apply migrations
4. Deploy
