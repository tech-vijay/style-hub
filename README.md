# StyleHub — Men's Fashion E-Commerce

A full-stack e-commerce application built with Next.js, Tailwind CSS, and Supabase.

## Project Structure

```
stylehub/
├── frontend/          # Next.js app (UI, pages, components)
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components (UI, layout, home, cart, product)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities, Supabase client, stores, types
│   ├── package.json   # Frontend dependencies
│   └── .env           # Frontend env vars (Supabase URL + anon key)
│
├── backend/          # Supabase backend (database + edge functions)
│   ├── supabase/
│   │   └── migrations/  # SQL migration files
│   ├── functions/      # Edge functions (Deno runtime)
│   └── .env.example    # Reference for backend env vars
│
├── netlify.toml       # Deployment config (Netlify)
└── .gitignore
```

## Quick Start (Local Development)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd stylehub
```

### 2. Set up the frontend

```bash
cd frontend
npm install
cp .env.example .env   # then fill in your Supabase keys
npm run dev
```

The app runs at `http://localhost:3000`.

### 3. Set up the backend (Supabase)

Your database is hosted on Supabase. To manage it:

- Go to your [Supabase Dashboard](https://supabase.com/dashboard)
- The SQL migration in `backend/supabase/migrations/` defines your full database schema (tables, indexes, and row-level security policies)
- To apply it to a new Supabase project, open the SQL Editor in the dashboard and run the migration file
- Edge functions live in `backend/functions/` and can be deployed from the Supabase dashboard

See `backend/README.md` for detailed backend setup instructions.

## Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (safe for browser) |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (secret — never expose to browser) |
| `SUPABASE_ANON_KEY` | Anon/public key |
| `DATABASE_URL` | Direct Postgres connection string |

## Deploying

### Frontend → Netlify

The `netlify.toml` at the project root is pre-configured. Connect your GitHub repo to Netlify and it will:

1. Install dependencies in `frontend/`
2. Build the Next.js app
3. Deploy automatically on every push to `main`

### Backend → Supabase

Supabase is already deployed as a managed service. To update your database schema:

1. Open the Supabase Dashboard
2. Go to SQL Editor
3. Paste and run the migration from `backend/supabase/migrations/`

To deploy edge functions, use the Supabase dashboard or CLI from the `backend/` folder.

## Tech Stack

- **Frontend:** Next.js 13, React 18, Tailwind CSS, shadcn/ui, Zustand, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions, Storage)
- **Deployment:** Netlify (frontend), Supabase (backend)
