# Flash Locatif — CLAUDE.md

> This file is read automatically by Claude Code at the start of every session.
> It contains all project context, conventions, and workflows.

---

## 🏠 What is Flash Locatif?

Flash Locatif is a French SaaS tool that automates the annual tax declaration for landlords ("propriétaires bailleurs").
It is inspired by FlashFiscal (which does the same for stock market income).

**Core user journey:**
1. Landlord arrives on the landing page
2. Creates an account
3. Fills in a guided form (number of properties, income, expenses)
4. The tool calculates the optimal tax regime (micro-foncier vs régime réel)
5. Generates a pre-filled PDF: formulaire 2044 + step-by-step guide for impots.gouv.fr
6. User pays to download the final documents

**Target user:** French landlord with 1–5 rental properties, self-managed, no accountant, at the régime réel.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for SEO, fast, modern |
| Language | TypeScript (strict mode) | Type safety, fewer runtime bugs |
| Styling | Tailwind CSS | Fast, no CSS files to manage |
| UI Components | shadcn/ui | Accessible, clean components |
| Auth | NextAuth.js v5 | Email/password + social login |
| Database | PostgreSQL via Prisma ORM | Reliable, relational data model |
| PDF generation | react-pdf / @react-pdf/renderer | Generate French tax forms as PDF |
| Payments | Stripe (subscriptions) | Annual billing, webhooks |
| Email | Resend + React Email | Transactional emails |
| Hosting | Vercel | Zero-config Next.js deployment |
| DB hosting | Supabase (Postgres) | Free tier, easy setup |

---

## 📁 Project Structure

```
flash-locatif/
├── app/                        # Next.js App Router pages
│   ├── (marketing)/            # Public pages (landing, pricing, blog)
│   │   ├── page.tsx            # Landing page (homepage)
│   │   ├── pricing/page.tsx    # Pricing page
│   │   └── blog/               # SEO blog articles
│   ├── (auth)/                 # Auth pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/            # Protected pages (logged-in users)
│   │   ├── dashboard/page.tsx  # User dashboard
│   │   ├── declaration/        # Multi-step declaration wizard
│   │   │   ├── step-1/         # Property profile
│   │   │   ├── step-2/         # Income input
│   │   │   ├── step-3/         # Expenses input
│   │   │   ├── step-4/         # Simulation results
│   │   │   └── step-5/         # PDF generation & payment
│   │   └── account/page.tsx    # Account settings
│   └── api/                    # API routes
│       ├── auth/               # NextAuth handlers
│       ├── stripe/             # Stripe webhooks
│       ├── declaration/        # CRUD for declarations
│       └── pdf/                # PDF generation endpoint
├── components/
│   ├── ui/                     # shadcn/ui base components
│   ├── marketing/              # Landing page sections
│   ├── dashboard/              # Dashboard widgets
│   └── declaration/            # Wizard step components
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── auth.ts                 # NextAuth config
│   ├── stripe.ts               # Stripe client
│   ├── tax-calculator.ts       # CORE: French tax calculation logic
│   ├── pdf-generator.ts        # PDF form generation
│   └── email.ts                # Email templates
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Never edit manually
├── public/
│   └── forms/                  # Static PDF templates (cerfa 2044)
├── CLAUDE.md                   # ← you are here
├── SPEC.md                     # Full product specification
└── prompt_plan.md              # Build task checklist (update as you go)
```

---

## 🧮 Core Business Logic — French Tax Rules

This is the most important part of the product. All calculations must be exact.

### Regime Selection Rules

```
IF annual gross rental income < 15,000€
  → User can choose between micro-foncier OR régime réel
  → Flash Locatif recommends the one that minimises tax
ELSE
  → Régime réel is mandatory
```

### Micro-Foncier Calculation

```
Taxable income = Gross rental income × 70%
(30% flat deduction, no actual expenses deducted)
```

### Régime Réel Calculation

```
Net foncier income = Gross rental income - Deductible expenses

Deductible expenses:
  - Mortgage interest (intérêts d'emprunt) — ONLY interest, not capital repayment
  - Property management fees (frais de gestion) — typically 7-10% of rent
  - Landlord insurance (assurance propriétaire non-occupant)
  - Property tax (taxe foncière) — minus the "taxe d'enlèvement des ordures ménagères" (TEOM)
  - Maintenance & repair works (travaux d'entretien et de réparation)
    ⚠️ NOT improvement works (travaux d'amélioration) — these are NOT deductible
  - Co-ownership charges (charges de copropriété) — only the landlord's share
  - Accounting fees (frais de comptabilité) if any

Net foncier income = Gross income - sum(deductible expenses)
```

### Déficit Foncier Rules

```
IF Net foncier income < 0 (i.e., expenses > income)
  → Déficit foncier exists

  Part attributable to interest:
    = Deficit up to the amount of mortgage interest paid
    → This part can ONLY be carried forward against future foncier income (10 years)
    → It CANNOT offset general income (revenu global)

  Part attributable to other expenses:
    = Remaining deficit (after subtracting interest portion)
    → Up to 10,750€/year can be deducted from revenu global (other income)
    → Remainder carried forward 10 years against foncier income
```

### Report of Previous Déficits

```
For each previous year (up to 10 years back):
  Apply remaining déficit to current net foncier income
  If net foncier income > 0 after applying déficit: stop
  If still negative: carry forward to next year
```

### Multiple Properties

```
All properties are pooled together (régime réel is global, not per-property)
Total net foncier income = Sum of all net incomes across all properties
Apply déficit rules to the total
```

---

## 🗄️ Database Schema (Prisma)

Key models — refer to `prisma/schema.prisma` for the full schema.

- `User` — authenticated user (email, subscription status, stripe customer id)
- `Declaration` — one declaration per user per tax year
- `Property` — a rental property belonging to a declaration
- `Income` — gross rental income per property
- `Expense` — line-item expenses per property (with type enum)
- `PreviousDeficit` — carried-forward déficits from prior years
- `Document` — generated PDF file references

---

## 🔑 Environment Variables

Never hardcode secrets. Always use `.env.local` (never committed to git).

Required vars:
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_SOLO=
STRIPE_PRICE_ID_MULTI=
RESEND_API_KEY=
```

---

## 📐 Code Style & Conventions

- **TypeScript strict mode** always on
- **No `any` types** — use proper types or `unknown`
- **Functional components only** — no class components
- **Server Components by default** — add `"use client"` only when needed (interactivity, hooks)
- **Co-locate logic** — keep component, types, and helpers in the same folder when small
- **Named exports** for components, default exports for pages (Next.js convention)
- **Zod for all form validation** — never trust raw user input
- **Error boundaries** on all dashboard routes
- Tailwind classes: use `cn()` utility from `lib/utils.ts` for conditional classes

---

## 🧪 Testing

- **Unit tests**: Vitest for pure functions (especially `tax-calculator.ts`)
- **E2E tests**: Playwright for critical flows (register → declare → pay → download PDF)
- Run tests: `npm run test`
- Run E2E: `npm run test:e2e`
- IMPORTANT: All tax calculation functions MUST have unit tests with known French tax scenarios

---

## ⚙️ Dev Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run typecheck    # TypeScript check (run before committing)
npm run lint         # ESLint
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright E2E tests
npx prisma studio    # Visual DB browser
npx prisma migrate dev  # Run DB migrations
npx prisma generate  # Regenerate Prisma client after schema changes
```

---

## 🚨 Critical Rules

1. **NEVER edit files in `prisma/migrations/`** — use `prisma migrate dev` only
2. **NEVER store tax calculation results as strings** — always use numbers (floats), format only for display
3. **NEVER skip validation** — every API route must validate inputs with Zod
4. **NEVER commit `.env.local`** — it is in `.gitignore`
5. **ALWAYS run `npm run typecheck` before considering a task done**
6. **ALWAYS write unit tests for any function in `lib/tax-calculator.ts`**
7. Tax logic questions → refer to SPEC.md Section 4 first, before guessing

---

## 📋 How to Work on This Project

1. Read `prompt_plan.md` and find the next uncompleted task
2. Implement it fully (component + types + tests if applicable)
3. Run `npm run typecheck` and `npm run lint` — fix all errors
4. Run `npm run test` — all tests must pass
5. Mark the task as complete in `prompt_plan.md`
6. Wait for review before moving to the next task
