# Project Rules & Conventions

## 1. Technologies
- **Next.js (App Router, Server Components where applicable)**
- **TypeScript (Strict mode)**
- **Supabase (Auth, Realtime PostgreSQL)**
- **Plate.js (Rich text handling)**
- **Tailwind CSS + ShadCN UI (for aesthetics)**

## 2. UI & Aesthetics (CRITICAL)
- **Responsive Layouts**: The application MUST be fully responsive. Mobile-first strategies must be implemented across all views (Dashboard, Editor, Auth).
- **Glassmorphism & Modern UI**: Utilize translucent backgrounds (`backdrop-blur`), subtle borders (`border-white/10` or similar), smooth shadows, and nuanced hover animations to achieve a "premium" feel.
- **Dark Mode First**: Support a first-class dark mode using `next-themes`.
- **Empty States**: Ensure empty document lists or loading screens use skeleton loaders or styled empty state messages.

## 3. Strict Guidelines Implementation
1. **No Missing Points**: Adhere 100% to the evaluation criteria from the project requirement document (Auth, Doc CRUD, Auto-Save Debounce 2-3s, Real-Time Collaboration).
2. **Separation of Concerns**: 
   - `app/` exclusively handles routing and Server Components or layouts.
   - `components/` contains reusable UI segments (e.g., `Sidebar.tsx`, `Navbar.tsx`).
   - `lib/` houses our utility functions, Supabase clients, and logic helpers.
3. **State Management**:
   - Prefer React server actions for mutations where latency allows, but since Real-time is needed, we will do client-side Supabase data fetching alongside Next.js standard data fetching where appropriate.
   - Use strict 2-to-3-second `useDebounce` on PlateJS changes before committing to DB.

## 4. Documentation
- Comment complex real-time syncing logic.
- Ensure the final README explains full setup instructions and trade-offs.
