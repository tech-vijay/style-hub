# Backend — Supabase

This folder contains everything related to the Supabase backend: database migrations, edge functions, and configuration.

## Structure

```
backend/
├── supabase/
│   └── migrations/        # SQL migration files (schema + RLS policies)
├── functions/             # Edge functions (Deno / TypeScript)
└── .env.example           # Reference for required env vars
```

## Database Setup

### Option A: Apply via Supabase Dashboard (recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Open the **SQL Editor**
4. Copy the contents of `supabase/migrations/20260728143854_stylehub_schema.sql`
5. Paste and run it

This creates all tables, indexes, and row-level security (RLS) policies.

### Option B: Apply via Supabase CLI

If you have the Supabase CLI installed locally:

```bash
cd backend
supabase db push
```

## Database Schema

The schema includes these tables:

| Table | Purpose | Access |
|---|---|---|
| `categories` | Product categories | Public read |
| `brands` | Product brands | Public read |
| `products` | Main product catalog | Public read |
| `product_images` | Multiple images per product | Public read |
| `product_variants` | Size/color combinations | Public read |
| `reviews` | Customer ratings | Public read, auth insert |
| `coupons` | Discount codes | Public read |
| `cart_items` | Per-user cart | Owner-scoped (auth) |
| `wishlist_items` | Per-user wishlist | Owner-scoped (auth) |
| `addresses` | Saved addresses | Owner-scoped (auth) |
| `orders` | Customer orders | Owner-scoped (auth) |
| `order_items` | Order line items | Owner-scoped via orders |

All tables have **Row Level Security (RLS)** enabled. User-owned tables use `auth.uid()` to ensure users can only access their own data.

## Edge Functions

Edge functions run on Deno and are deployed to Supabase's edge network. To add a new function:

1. Create a folder in `functions/` with your function name
2. Add an `index.ts` file with your handler
3. Deploy via the Supabase dashboard or CLI

Example function structure:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  // your logic here
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});
```

## Integrating Other Services

Since the backend is Supabase, you can extend it by:

1. **Adding tables** — Create new migration files in `supabase/migrations/` and run them in the dashboard
2. **Edge functions** — Add serverless functions in `functions/` to proxy external APIs (payment gateways, shipping, email, etc.)
3. **Webhooks** — Use edge functions as webhook receivers for third-party services
4. **Storage** — Use Supabase Storage for file uploads (product images, etc.)

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Dashboard → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard → Project Settings → API → service_role key |
| `SUPABASE_ANON_KEY` | Dashboard → Project Settings → API → anon key |
| `DATABASE_URL` | Dashboard → Project Settings → Database → Connection string |
