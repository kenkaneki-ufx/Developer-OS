# Developer OS

A personal productivity dashboard that I keep building on. It holds the stuff I actually check every day — tasks, my class schedule, DSA practice, learning roadmaps, notes, projects and a bit of college planning — and an AI chat that helps out while I work.

**Live:** [developer-os-phi.vercel.app](https://developer-os-phi.vercel.app)  [![deployed](https://deploy-badge.vercel.app/?url=https://developer-os-phi.vercel.app&name=Developer%20OS)](https://developer-os-phi.vercel.app)

## Why I made this

I was the person with notes in one app, DSA progress in a spreadsheet, assignments in a calendar and project ideas in a chat with myself. It sort of worked, until it didn't. So I started putting together a dashboard that had everything in one tab, and it slowly became the first thing I open in the morning. The AI assistant started as a weekend experiment and honestly ended up as the most used feature.

## What's inside

In roughly the order I use it:

- **Dashboard** — a daily overview with tasks, deadlines, today's schedule and quick stats.
- **AI chat & smart tasks** — describe a task in plain English and it gets broken down for you. Works out of the box, no API key needed on your side.
- **DSA tracker** — around 150 problems across topics, with progress, difficulty breakdown and streaks. You can link a LeetCode account.
- **Roadmaps** — step-by-step ML and programming paths with checkpoints.
- **Notes** — a markdown editor with tags and search. Stored locally in the browser (IndexedDB) for now.
- **Projects** — track what you're building, link a GitHub repo and pull in your stats.
- **College planner** — semesters, assignments, attendance and AKTU syllabus stuff.
- **Reviews & analytics** — weekly and monthly pages that show how the week actually went.

Sign in with Google or GitHub, or just use the demo login to click around. Dark / light / system theme, responsive layout.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Prisma + Postgres (I host mine on Supabase) · NextAuth v5 · TanStack Query · Framer Motion. Vitest for tests.

## Repo layout

The app lives in the **`developer-os/`** folder at the root of this repo — everything above it is just this README, the LICENSE and git history. So when you deploy to Vercel, remember to set the **Root Directory to `developer-os`**.

## Running it locally

```bash
git clone https://github.com/kenkaneki-ufx/Developer-OS.git
cd Developer-OS/developer-os
npm install
cp .env.example .env.local      # then fill in DATABASE_URL, keys, etc.
npm run db:generate
npm run db:migrate
npm run dev
```

Open http://localhost:3000.

`.env.example` lists every variable. `DATABASE_URL` is the only strictly required one — if you skip the OAuth keys the app falls back to demo login, which is convenient for a quick look.

## Useful commands

```bash
npm run dev          # dev server with Turbopack
npm run build        # production build
npm run start        # serve the production build
npm run lint         # eslint
npm run test         # vitest
npm run db:studio    # browse the DB in Prisma Studio
npm run db:seed      # optional seed data
```

## Known rough edges

- Notes don't sync across devices yet — they live in the browser. I want to move them server-side eventually.
- Some widgets start with sample data until you link GitHub/LeetCode or enter your own.
- The AI chat defaults to the built-in provider; if you'd rather use your own, there are OpenAI/Anthropic/Gemini/Cohere adapters in `src/lib/ai/providers`.
- Account auto-linking and OAuth behaviour live in `src/auth.ts` if you want to tweak them.

MIT licensed — fork it or lift whatever bits you find useful.
