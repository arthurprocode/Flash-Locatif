# Flash Locatif — Prompt Plan

> Claude Code reads this file to know what to build next.
> After completing each task, mark it `[x]` and commit before moving to the next.
> Do NOT skip tasks — each one depends on the previous.

---

## How to use this file

Tell Claude Code:
> "Open prompt_plan.md, find the first uncompleted task, implement it fully, run typecheck and tests, then mark it done and wait for my review."

---

## Phase 0 — Project Setup

- [x] **0.1** Initialize Next.js 14 project with TypeScript strict mode
  - `npx create-next-app@latest flash-locatif --typescript --tailwind --eslint --app --src-dir=false`
  - Install additional deps: `npm install prisma @prisma/client next-auth@beta zod @react-pdf/renderer stripe resend sonner`
  - Install dev deps: `npm install -D vitest @vitejs/plugin-react playwright prettier`
  - Configure `tsconfig.json` with `strict: true`
  - Add `vitest.config.ts` with React plugin
  - Add `playwright.config.ts` for E2E

- [x] **0.2** Configure Tailwind with brand colors
  - Update `tailwind.config.ts` with brand colors from SPEC.md Section 11
  - Install and configure Inter font from Google Fonts in `app/layout.tsx`
  - Add global CSS reset in `app/globals.css`

- [ ] **0.3** Set up shadcn/ui
  - `npx shadcn-ui@latest init`
  - Install components: `button`, `card`, `input`, `label`, `select`, `badge`, `tooltip`, `dialog`, `table`, `toast`

- [ ] **0.4** Set up Prisma + Supabase
  - `npx prisma init`
  - Write full schema in `prisma/schema.prisma` based on SPEC.md Section (all models: User, Declaration, Property, Income, Expense, PreviousDeficit, Document)
  - Create `.env.local` template file (`.env.example`) with all required vars from CLAUDE.md
  - Run `npx prisma generate`
  - Create `lib/db.ts` with Prisma client singleton

- [ ] **0.5** Set up NextAuth.js v5
  - Create `lib/auth.ts` with CredentialsProvider (email/password)
  - Create `app/api/auth/[...nextauth]/route.ts`
  - Create middleware `middleware.ts` to protect dashboard routes
  - Test that unauthenticated access to `/dashboard` redirects to `/login`

- [ ] **0.6** Set up project structure
  - Create all empty folders per the structure in CLAUDE.md
  - Create `lib/utils.ts` with `cn()` Tailwind helper
  - Create `lib/stripe.ts` with Stripe client init
  - Create `lib/email.ts` with Resend client init (stub)

---

## Phase 1 — Core Business Logic (Tax Calculator)

- [ ] **1.1** Implement tax calculation types
  - Create `lib/tax-calculator.ts`
  - Define all TypeScript interfaces from SPEC.md Section 4.1 and 4.2
  - No implementation yet, just types

- [ ] **1.2** Implement `calculateMicroFoncier()`
  - Pure function, no side effects
  - Handle ineligibility (gross income >= 15,000€)
  - Write unit tests for Scenario A from SPEC.md Section 4.4

- [ ] **1.3** Implement `calculateRegimeReel()`
  - Pure function, no side effects
  - Handle all deductible expense types
  - Implement déficit foncier logic (see SPEC.md Section 4.3 for exact rules)
  - Write unit tests for Scenarios B, C, D from SPEC.md Section 4.4

- [ ] **1.4** Implement `recommendRegime()` and `runFullCalculation()`
  - Compare micro vs réel taxable income
  - Return full TaxCalculationResult
  - Write integration test that runs all 4 scenarios end-to-end

- [ ] **1.5** Run all tax calculator tests
  - `npm run test` — all tests must pass
  - Fix any calculation errors

---

## Phase 2 — Database & API Layer

- [ ] **2.1** Run Prisma migration
  - `npx prisma migrate dev --name init`
  - Verify all tables created in Supabase

- [ ] **2.2** Build Declaration API routes
  - `POST /api/declaration` — create new declaration
  - `GET /api/declaration/[id]` — get declaration by id (auth check: must be owner)
  - `PUT /api/declaration/[id]` — update declaration data
  - All routes: Zod validation, auth check, proper error responses per SPEC.md Section 12

- [ ] **2.3** Build Property API routes
  - `POST /api/declaration/[id]/property` — add property to declaration
  - `PUT /api/declaration/[id]/property/[propertyId]` — update property
  - `DELETE /api/declaration/[id]/property/[propertyId]` — remove property

- [ ] **2.4** Build PDF generation API
  - `POST /api/declaration/[id]/generate-pdf` — triggers PDF generation
  - Requires paid status check (declaration.paidAt must not be null)
  - Returns signed URL or base64 PDF
  - Stub implementation: return a placeholder PDF with "Flash Locatif — Formulaire 2044" text

---

## Phase 3 — Shared UI Components

- [ ] **3.1** Build base components
  - `components/ui/currency-input.tsx` — formatted euro input (e.g., "1 240,00 €")
  - `components/ui/step-progress.tsx` — progress bar for the 5-step wizard
  - `components/ui/regime-badge.tsx` — "Régime Réel Recommandé" badge
  - `components/ui/tooltip-label.tsx` — label + info icon + tooltip for tax explanations

- [ ] **3.2** Build regime comparison component
  - `components/declaration/regime-comparison.tsx`
  - Side-by-side table: Micro-Foncier vs Régime Réel
  - Highlight recommended column in green
  - Show savings amount prominently
  - Takes `TaxCalculationResult` as prop

- [ ] **3.3** Build pricing card component
  - `components/marketing/pricing-card.tsx`
  - Props: plan name, price, features list, recommended (boolean), CTA button
  - Highlighted border if `recommended=true`

---

## Phase 4 — Authentication Pages

- [ ] **4.1** Build login page
  - Route: `/login`
  - Email + password form
  - Zod validation client-side
  - Error handling (wrong credentials, etc.)
  - Link to `/register` and forgot password

- [ ] **4.2** Build register page
  - Route: `/register`
  - Email + password + confirm password
  - Zod validation (email format, password min 8 chars)
  - On success: redirect to `/dashboard`

- [ ] **4.3** Build forgot password flow
  - `/forgot-password` — email input form, sends reset email via Resend
  - `/reset-password?token=xxx` — new password form, validates token

---

## Phase 5 — Landing Page

- [ ] **5.1** Build landing page hero section
  - Route: `/` (app/(marketing)/page.tsx)
  - Headline, sub-headline, 2 CTA buttons
  - Clean, modern design using brand colors
  - Fully responsive (mobile-first)

- [ ] **5.2** Build problem + solution sections
  - 3 pain points (icons from lucide-react)
  - 3 benefits
  - Visual separator between sections

- [ ] **5.3** Build "How it works" section
  - 3 numbered steps with icons
  - Clean horizontal layout on desktop, vertical on mobile

- [ ] **5.4** Build pricing section
  - Use PricingCard component (built in 3.3)
  - 3 plans: Solo (49€), Multi (89€), Pro (149€)
  - "Multi" plan highlighted as recommended
  - Each card: plan name, price, features list, CTA button

- [ ] **5.5** Build FAQ section
  - Accordion component (shadcn Accordion)
  - 5 questions from SPEC.md Section 3

- [ ] **5.6** Build footer
  - Logo + tagline
  - Links: Mentions légales, CGV, Contact
  - Copyright line

- [ ] **5.7** Add SEO meta tags to landing page
  - `<title>` and `<meta name="description">` targeting primary keyword
  - Open Graph tags
  - Structured data (JSON-LD for SoftwareApplication)

---

## Phase 6 — Dashboard

- [ ] **6.1** Build dashboard layout
  - `app/(dashboard)/layout.tsx` — sidebar nav + top bar
  - Sidebar links: Dashboard, Nouvelle déclaration, Mon compte
  - Top bar: user email + logout button
  - Mobile: hamburger menu

- [ ] **6.2** Build dashboard home
  - Route: `/dashboard`
  - If no declarations: empty state with "Commencer ma déclaration" CTA
  - If declarations exist: list with status (en cours / complété / payé), year, CTA to continue or view

---

## Phase 7 — Declaration Wizard

- [ ] **7.1** Build wizard shell
  - `app/(dashboard)/declaration/[id]/layout.tsx`
  - StepProgress component showing current step
  - "Save and continue later" button
  - Back/Next navigation

- [ ] **7.2** Build Step 1 — Profile
  - Tax year selector
  - Number of properties input
  - Prior déficits toggle + table input
  - Auto-save on next click via PUT /api/declaration/[id]

- [ ] **7.3** Build Step 2 — Income
  - Repeat per property (dynamically based on Step 1 count)
  - Property nickname + gross rent + tenant charges
  - Running total display
  - Eligibility banner for micro-foncier

- [ ] **7.4** Build Step 3 — Expenses
  - Repeat per property
  - All expense fields from SPEC.md Section 5
  - Tooltips on mortgage interest, property tax (TEOM), and maintenance works
  - Running expense totals

- [ ] **7.5** Build Step 4 — Simulation
  - Fetch declaration data, run `runFullCalculation()` client-side
  - Display RegimeComparison component
  - Display déficit explanation (if applicable)
  - "Générer mon formulaire 2044" CTA button → Step 5

- [ ] **7.6** Build Step 5 — Payment
  - Plan selector (Solo / Multi / Pro)
  - Stripe checkout button (creates Stripe checkout session via API)
  - On return from Stripe success: redirect to `/declaration/[id]/documents`

- [ ] **7.7** Build Documents page
  - Route: `/declaration/[id]/documents`
  - Download PDF button (formulaire 2044)
  - Download PDF button (step-by-step guide)
  - "Déclarer sur impots.gouv.fr" button (external link)

---

## Phase 8 — PDF Generation

- [ ] **8.1** Build formulaire 2044 PDF template
  - `lib/pdf/form-2044.tsx` using @react-pdf/renderer
  - Pre-fill all fields from SPEC.md Section 7
  - Style to resemble official cerfa form (grey headers, bordered boxes)
  - Include user name and tax year in header

- [ ] **8.2** Build step-by-step guide PDF
  - `lib/pdf/declaration-guide.tsx`
  - 4–5 pages explaining how to use the 2044 result on impots.gouv.fr
  - Text-based (no screenshots needed in MVP)
  - Professional layout with Flash Locatif branding

- [ ] **8.3** Wire PDF generation to API
  - Update `POST /api/declaration/[id]/generate-pdf` to use real templates
  - Store generated PDF (base64 or Supabase storage)
  - Update Document record in DB with download URL

---

## Phase 9 — Stripe & Payments

- [ ] **9.1** Build Stripe checkout session API
  - `POST /api/stripe/checkout` — creates session for selected plan
  - Include declaration ID in metadata
  - Success URL: `/declaration/[id]/documents?session_id={CHECKOUT_SESSION_ID}`

- [ ] **9.2** Build Stripe webhook handler
  - `POST /api/stripe/webhook`
  - Handle `checkout.session.completed`: mark declaration as paid, trigger PDF generation
  - Handle `payment_intent.payment_failed`: update status, send email
  - Verify Stripe webhook signature

---

## Phase 10 — Email

- [ ] **10.1** Build welcome email template
  - `emails/welcome.tsx` using React Email
  - Preview with `email dev` command

- [ ] **10.2** Build "declaration ready" email
  - `emails/declaration-ready.tsx`
  - Includes download link and impots.gouv.fr CTA

- [ ] **10.3** Wire emails to triggers
  - Registration → send welcome email
  - Payment success → send declaration ready email

---

## Phase 11 — SEO Blog

- [ ] **11.1** Build blog index page
  - Route: `/blog`
  - List of articles with title, description, date
  - SEO meta tags

- [ ] **11.2** Create 4 stub blog articles
  - See SPEC.md Section 10 for slugs and titles
  - Each article: 500+ words, proper heading structure (H1, H2, H3)
  - Rich SEO meta (title, description, canonical)

---

## Phase 12 — Polish & Launch Prep

- [ ] **12.1** Add rate limiting to auth routes
  - Use middleware to limit to 10 req/min on `/api/auth`

- [ ] **12.2** Add error boundaries
  - Wrap all dashboard routes in `<ErrorBoundary>`
  - Custom error page `app/error.tsx`
  - Custom 404 page `app/not-found.tsx`

- [ ] **12.3** Performance audit
  - Run Lighthouse on landing page
  - Fix any score < 90
  - Ensure all images use `next/image` with proper sizing

- [ ] **12.4** Final typecheck + test run
  - `npm run typecheck` — zero errors
  - `npm run test` — all unit tests pass
  - `npm run test:e2e` — registration → declaration → payment flow passes

- [ ] **12.5** Deploy to Vercel
  - Connect GitHub repo to Vercel
  - Set all env vars in Vercel dashboard
  - Test production URL
  - Set up custom domain `flashlocatif.fr`

---

## Notes for Claude Code

- If a task takes more than 30 minutes, split it and check in
- Always prefer simple, readable code over clever abstractions in MVP
- When in doubt about tax logic: re-read SPEC.md Section 4 carefully
- The tax calculator is the heart of the product — get it right before building UI
- Run `npm run typecheck` after EVERY task. Do not skip this.
