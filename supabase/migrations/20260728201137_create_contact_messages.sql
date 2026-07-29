/*
# Create contact_messages table

## Purpose
Stores submissions from the website's contact form so the store owner can
read and respond to customer enquiries. Previously the contact form only
showed a toast and discarded the message.

## New Table
- `contact_messages`
  - `id` (uuid, primary key)
  - `name` (text, not null) — sender's name
  - `email` (text, not null) — sender's email
  - `message` (text, not null) — the enquiry body
  - `status` (text, default 'new') — new / read / replied, for admin triage
  - `created_at` (timestamptz, default now())

## Security
- RLS enabled.
- Anyone (anon + authenticated) can INSERT — a contact form must work for
  visitors who are not logged in.
- Only authenticated users can SELECT — protects customer messages from
  public scraping. Admin reads these.
- No UPDATE or DELETE policies (not needed by the app).
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);
