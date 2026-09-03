# 🚀 Developer OS

> **Your second brain for everything you study, learn, build, complete, review and track.**

**🚀 Live app:** [developer-os-phi.vercel.app](https://developer-os-phi.vercel.app)

[![Deployment Status](https://deploy-badge.vercel.app/?url=https://developer-os-phi.vercel.app&name=Developer%20OS)](https://developer-os-phi.vercel.app) · [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://developer-os-phi.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [✨ Key Features](#-key-features)
- [🧰 Built With](#-built-with)
- [📂 Project Structure](#-project-structure)
- [🏁 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#-environment-variables)
  - [Database Setup](#-database-setup)
- [🚀 Running the Application](#-running-the-application)
- [🧪 Testing](#-testing)
- [📦 Available Scripts](#-available-scripts)
- [🔐 Authentication](#-authentication)
- [🎨 UI/UX Features](#-uiux-features)
- [🗄️ Database Schema](#️-database-schema)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 About The Project

**Developer OS** is a comprehensive developer productivity platform that serves as your personal operating system for managing all aspects of your development journey. Whether you're preparing for coding interviews, tracking your machine learning progress, managing projects, or organizing your college coursework — Developer OS has you covered.

Built with modern web technologies and powered by AI, this application provides a beautiful, intuitive interface to help developers stay organized, productive, and focused on what matters most.

---

## ✨ Key Features

### 🤖 AI-Powered Tasks
- Smart task generation from natural language descriptions
- AI learns your work patterns for intelligent prioritization
- Automatic time estimation and deadline suggestions
- Natural language task creation interface

### 💻 DSA Tracking
- Track progress across 150+ curated Data Structures & Algorithms problems
- Topic-wise progress tracking (Arrays, Trees, Graphs, DP, etc.)
- Difficulty breakdown analytics
- Streak tracking and goal setting
- Integration with LeetCode

### 🧠 ML Roadmaps
- Structured learning paths for Machine Learning
- Milestone checkpoints and progress visualization
- Curated resource recommendations
- Track progress from beginner to advanced

### 🚀 Project Management
- Comprehensive project tracking dashboard
- GitHub repository linking and synchronization
- Progress tracking with visual indicators
- Deadline management and technology tagging
- Import/export projects as JSON

### 📝 Smart Notes
- Markdown editor with live preview
- AI-powered formatting and suggestions
- Tag-based organization system
- Full-text search across all notes
- Folder hierarchy for organization

### 📊 Analytics Dashboard
- Weekly and monthly productivity charts
- Goal completion rate tracking
- Time allocation breakdown
- Trend analysis and insights

### 🎓 College Planner
- Course and semester management
- Assignment tracking with due dates
- Exam preparation and grade tracking
- Attendance monitoring
- AKTU syllabus integration

### 🔗 Integrations
- **GitHub**: Repository sync, contribution tracking
- **LeetCode**: Problem tracking, diagnostic analysis
- **AI Chat**: Context-aware assistant for queries

---

## 🧰 Built With

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React Framework with App Router |
| [React 19](https://react.dev/) | UI Library |
| [TypeScript 5.7](https://www.typescriptlang.org/) | Type Safety |
| [Tailwind CSS 3.4](https://tailwindcss.com/) | Styling |
| [Prisma 6.1](https://www.prisma.io/) | ORM & Database |
| [PostgreSQL](https://www.postgresql.org/) | Database |
| [NextAuth.js 5](https://next-auth.js.org/) | Authentication |
| [Tanstack React Query](https://tanstack.com/query) | Data Fetching |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Radix UI](https://www.radix-ui.com/) | UI Components |
| [Zod](https://zod.dev/) | Schema Validation |
| [Vitest](https://vitest.dev/) | Testing |

---

## 📂 Project Structure

```
Developer-OS/
├── README.md
├── LICENSE
└── developer-os/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Database seed data
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth handlers
│   │   │   ├── github/        # GitHub integration
│   │   │   ├── leetcode/      # LeetCode integration
│   │   │   └── sync/          # Data synchronization
│   │   ├── auth/              # Auth pages (login, error)
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── ai-chat/       # AI chat interface
│   │   │   ├── analytics/     # Analytics dashboard
│   │   │   ├── college/       # College planner
│   │   │   ├── dsa/           # DSA tracking
│   │   │   ├── github/        # GitHub integration
│   │   │   ├── leetcode/      # LeetCode tracking
│   │   │   ├── notes/         # Smart notes
│   │   │   ├── projects/      # Project management
│   │   │   ├── reviews/       # Weekly/monthly reviews
│   │   │   ├── roadmaps/      # ML & Programming roadmaps
│   │   │   ├── schedule/      # Schedule planner
│   │   │   ├── settings/      # User settings
│   │   │   └── tasks/         # Task management
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── layout/            # Header, Sidebar
│   │   ├── providers/         # Context providers
│   │   └── ui/                # Reusable UI components
│   ├── features/              # Feature-specific modules
│   │   ├── college/           # College feature
│   │   ├── dashboard/         # Dashboard widgets
│   │   ├── dsa/               # DSA tracking
│   │   ├── notes/             # Notes feature
│   │   ├── projects/          # Projects feature
│   │   └── tasks/             # Tasks feature
│   ├── lib/                   # Utility functions
│   │   ├── prisma.ts          # Prisma client
│   │   ├── github.ts          # GitHub helpers
│   │   └── leetcode.ts        # LeetCode helpers
│   └── auth.ts                # NextAuth configuration
├── .env.example               # Environment variables template
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── vitest.config.ts           # Test configuration
└── package.json               # Dependencies and scripts
```

---

## 🏁 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) or **yarn** or **pnpm**
- **PostgreSQL** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Quick Setup

```bash
git clone https://github.com/kenkaneki-ufx/Developer-OS.git
cd Developer-OS/developer-os
npm install
cp .env.example .env.local   # then fill in your values
npm run db:generate
npm run db:migrate
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

### 📦 Manual Installation

If you prefer manual setup:

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/developer-os.git
   cd developer-os
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see below)

5. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate

   # (Optional) Seed the database
   npm run db:seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/developer_os` |

### Optional - Authentication

| Variable | Description |
|----------|-------------|
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `AUTH_SECRET` | NextAuth secret key (generate with `npx auth secret`) |

> **Note:** If OAuth credentials are not configured, the app will run in demo mode with a credentials-based login.


---

## 🗄️ Database Setup

### Setting up PostgreSQL

1. **Create a new database**

   ```sql
   1 -> Visit link : "https://supabase.com/"
   2 -> Click [ Strart your project ]
   3 -> Click [ +New project ]
   ```

2. **Update DATABASE_URL** in `.env.local`

   ```
   DATABASE_URL= [GENERATE_ME_WITH_STEPS_ABOVE]
   ```

3. **Run Prisma migrations**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Open Prisma Studio** (optional - for visual database management)

   ```bash
   npm run db:studio
   ```

### Database Models

The schema includes the following main models:

- **User** - User accounts and authentication
- **Profile** - User profiles with skills and goals
- **Project** - Project management with milestones
- **Task** - AI-powered task system
- **Note** - Smart notes with markdown support
- **DSATopic/Progress** - DSA tracking
- **MLTopic/Progress** - ML roadmap tracking
- **CollegeData** - College planner
- **GitHubData** - GitHub integration
- **AIConversation** - AI chat history
- **DailyAnalytics** - Productivity analytics

---

## 🚀 Running the Application

### Development Mode

```bash
cd developer-os
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000) with Turbopack for fast HMR.

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 📦 Available Scripts

### NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run test` | Run tests with Vitest |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

---

## 🔐 Authentication

Developer OS supports multiple authentication methods:

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set the callback URL to `http://localhost:3000/api/auth/callback/github`
4. Add `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` to `.env.local`

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Set the authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
4. Add `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` to `.env.local`

### Demo Mode

If no OAuth providers are configured, you can use the demo account:
- Email: Any valid email format
- Password: Any password

---

## 🎨 UI/UX Features

### Animations & Interactions
- **Framer Motion** powered page transitions
- Animated counters and progress indicators
- Smooth hover effects and micro-interactions
- Floating particles background animation

### Theme Support
- Dark mode (default)
- Light mode
- System preference detection
- Persistent theme selection

### Responsive Design
- Mobile-first approach
- Collapsible sidebar navigation
- Adaptive layouts for all screen sizes

### Custom Components
- Animated cards with 3D perspective effects
- Progress rings and bars
- Toast notifications
- Skeleton loading states

---

## 🗃️ Key Features Deep Dive

### 📋 Task Management

```typescript
// Tasks support:
- AI-generated tasks from natural language
- Priority levels (Low, Medium, High, Urgent)
- Status tracking (Todo, In Progress, In Review, Completed)
- Subtasks and dependencies
- Time estimation and tracking
- Recurring tasks
```

### 📊 Analytics

The analytics dashboard tracks:
- Daily coding minutes
- Study session duration
- Tasks completed
- Questions solved
- Commits made
- Productivity scores

### 🔗 GitHub Integration

- Link your GitHub account
- Sync repositories automatically
- Track contributions and streaks
- View repository statistics

### 🎯 DSA Progress

- Track 150+ curated problems
- Categorized by topic (Arrays, Trees, Graphs, DP, etc.)
- Difficulty breakdown (Easy, Medium, Hard)
- Confidence tracking
- Resource recommendations

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

<div align="center">

**Made with ❤️ for developers, by developers**

[Report Bug](https://github.com/your-username/developer-os/issues) · [Request Feature](https://github.com/your-username/developer-os/issues)

</div>