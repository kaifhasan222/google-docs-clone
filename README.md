# Mini Google Docs Clone

A collaborative document editor built with Next.js App Router, TypeScript, Supabase, and Plate.js.

## Implemented Features

- Email/password authentication with Supabase Auth
- Persistent user session
- Create, open, list, and delete documents
- Rich text editing with Plate.js
- Formatting toolbar with:
  - Bold
  - Italic
  - Underline
  - Headings
  - Bullet lists
  - Numbered lists
- Auto-save with debounce and save status feedback
- Near real-time document sync with Supabase realtime listeners
- Presence indicator for active editors
- Share by link
- Role-based access for viewer/editor flows
- Responsive dashboard and editor UI

## Tech Stack

- Next.js 16.2.0 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
  - Auth
  - Postgres
  - Realtime
- Plate.js rich text editor
- Base UI and Lucide React for UI primitives/icons

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Create the required Supabase tables and policies:

- `documents`
- `document_collaborators`
- `document_access_requests`

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`

## Deployment

This project is intended to be deployed on Vercel.

Required environment variables on Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Tech Decisions

- Next.js App Router keeps page structure, layouts, and server/client boundaries clear.
- Supabase covers authentication, database storage, and realtime sync in one backend.
- Plate.js was chosen for structured rich text editing with extensible plugins.
- Debounced auto-save avoids excessive writes while keeping the editor responsive.
- The collaboration model uses simple realtime updates instead of CRDT/OT because the assignment explicitly allows a simpler sync approach.

## Assumptions And Trade-Offs

- Realtime collaboration is implemented as a practical near real-time sync layer, not full conflict-free collaborative editing.
- Presence is lightweight and intended to satisfy the optional requirement without adding complex session orchestration.
- Sharing and collaborator access are implemented as assignment bonus features.
- The project currently assumes Supabase schema and RLS are configured correctly before local run or deployment.

## Notes

- If you are using Next.js 16 conventions strictly, `middleware` should be migrated to `proxy` in a follow-up cleanup.
