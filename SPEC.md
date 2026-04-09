# Flash Locatif — Product Specification (SPEC.md)

> Full technical and product spec for Claude Code to implement the website.
> Reference this file for any question about what the product should do.

---

## 1. Product Overview

Flash Locatif is a French SaaS tool that automates the annual tax declaration for landlords.

**Core value proposition:** "Votre déclaration de revenus fonciers en 10 minutes, sans comptable."

**MVP scope:**
- Multi-step wizard to collect landlord data
- Automatic tax regime recommendation (micro-foncier vs régime réel)
- Calculation of déficit foncier and carry-forwards
- Generation of pre-filled formulaire 2044 as a downloadable PDF
- Step-by-step guide for entering results on impots.gouv.fr
- Stripe payment to unlock PDF download
- User authentication (email/password)
- Basic account management

**Out of MVP scope (future):**
- LMNP (Location Meublée Non Professionnelle)
- SCI (Société Civile Immobilière)
- Import from rental management software
- Direct filing to impots.gouv.fr

---

## 2. Pages & Routes

### Public (unauthenticated)

| Route | Page | Description |
|---|---|---|
| `/` | Landing page | Hero, problem, solution, features, pricing, FAQ, CTA |
| `/pricing` | Pricing page | Detailed comparison of plans |
| `/blog` | Blog index | SEO articles list |
| `/blog/[slug]` | Blog article | Individual SEO article |
| `/login` | Login | Email/password login form |
| `/register` | Register | Email/password registration form |
| `/legal` | Legal notices | CGU, CGV, Privacy policy |

### Protected (authenticated, requires active session)

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Summary of declarations, status, CTA to start new |
| `/declaration/new` | Start wizard | Creates new Declaration record |
| `/declaration/[id]/step-1` | Step 1: Profile | Number of properties, tax year, prior deficits |
| `/declaration/[id]/step-2` | Step 2: Income | Gross rent per property |
| `/declaration/[id]/step-3` | Step 3: Expenses | All deductible expenses per property |
| `/declaration/[id]/step-4` | Step 4: Simulation | Regime recommendation, tax result preview |
| `/declaration/[id]/step-5` | Step 5: Payment | Stripe checkout, then PDF download |
| `/declaration/[id]/documents` | Documents | Access downloaded PDFs for a completed declaration |
| `/account` | Account | Email, password change, subscription management |

---

## 3. Landing Page Specification

### Hero Section
- Headline: "Votre déclaration de revenus fonciers en 10 minutes, sans comptable"
- Sub-headline: "Flash Locatif calcule automatiquement votre régime optimal et génère votre formulaire 2044 pré-rempli."
- CTA button (primary): "Commencer ma déclaration" → `/register`
- CTA button (secondary): "Voir comment ça marche" → scrolls to demo section
- Social proof line: "Rejoignez [X] propriétaires qui ont simplifié leur déclaration"

### Problem Section
- Title: "Chaque année, la même galère"
- 3 pain points (icons + short text):
  1. "Des heures perdues à décrypter le formulaire 2044"
  2. "La peur de se tromper de régime et de payer trop d'impôts"
  3. "400€ minimum chez un expert-comptable pour un travail répétitif"

### Solution Section
- Title: "Flash Locatif fait tout ça pour vous"
- 3 benefits (icons + short text):
  1. "Choisit automatiquement le régime le plus avantageux pour vous"
  2. "Génère votre formulaire 2044 pré-rempli, prêt à déclarer"
  3. "Guide vous case par case sur impots.gouv.fr"

### How It Works Section
- Title: "3 étapes, 10 minutes"
- Step 1: "Renseignez vos loyers et vos charges" (icon: form)
- Step 2: "On calcule votre régime optimal" (icon: calculator)
- Step 3: "Téléchargez votre formulaire pré-rempli" (icon: download)

### Pricing Section (see Section 6 for full pricing details)

### FAQ Section
- Q: "Flash Locatif remplace-t-il un expert-comptable ?"
  A: "Non. Flash Locatif automatise la déclaration standard. Pour des situations complexes (SCI, LMNP, restructuration patrimoniale), consultez un professionnel."
- Q: "Mes données sont-elles sécurisées ?"
  A: "Oui. Vos données sont chiffrées, hébergées en Europe, et ne sont jamais revendues."
- Q: "Et si le formulaire contient une erreur ?"
  A: "Nous offrons une garantie satisfait ou remboursé sous 30 jours. Si une erreur de calcul nous est imputable, nous vous remboursons intégralement."
- Q: "Est-ce valable pour les locations meublées (LMNP) ?"
  A: "Pas encore. Flash Locatif couvre uniquement la location nue (revenus fonciers). Le LMNP arrive dans une prochaine version."
- Q: "Pour quelle année puis-je déclarer ?"
  A: "Pour l'année fiscale en cours (déclaration faite au printemps). Vous pouvez aussi corriger des déclarations des 2 dernières années."

---

## 4. Tax Calculation Specification

> IMPORTANT: Implement all logic in `lib/tax-calculator.ts`. All functions must be pure (no side effects) and must have unit tests.

### 4.1 Input Data Structure

```typescript
interface TaxInputData {
  taxYear: number; // e.g., 2024
  properties: Property[];
  previousDeficits: PreviousDeficit[]; // from prior years
}

interface Property {
  id: string;
  name: string; // e.g., "Appartement Paris 11e"
  income: PropertyIncome;
  expenses: PropertyExpenses;
}

interface PropertyIncome {
  grossRent: number; // Total rent collected (all charges included)
  rentChargesRecovered: number; // Charges locatives récupérées sur locataire
}

interface PropertyExpenses {
  mortgageInterest: number;       // Intérêts d'emprunt (NOT capital)
  propertyManagementFees: number; // Frais d'agence ou de gestion
  landlordInsurance: number;      // Assurance PNO
  propertyTax: number;            // Taxe foncière (hors TEOM)
  maintenanceWorks: number;       // Travaux d'entretien/réparation
  condoFees: number;              // Charges de copropriété (part propriétaire)
  accountingFees: number;         // Frais de comptabilité
  otherDeductible: number;        // Autres charges déductibles
}

interface PreviousDeficit {
  year: number;
  interestPortion: number;        // Déficit lié aux intérêts (reportable sur foncier only)
  otherPortion: number;           // Déficit lié aux autres charges (peut réduire revenu global)
}
```

### 4.2 Output Data Structure

```typescript
interface TaxCalculationResult {
  regime: "micro" | "reel";
  recommendation: "micro" | "reel";   // which regime we recommend
  microResult: MicroResult;
  reelResult: ReelResult;
  savingsWithOptimalRegime: number;   // euros saved vs the other regime
}

interface MicroResult {
  grossIncome: number;
  abatement: number;              // 30% flat deduction
  taxableIncome: number;
  eligibleForMicro: boolean;      // false if income >= 15,000€
}

interface ReelResult {
  grossIncome: number;
  totalDeductibleExpenses: number;
  netFoncierBeforeDeficit: number;
  deficitApplied: number;         // From previous years
  netFoncierFinal: number;        // Can be negative
  deficitGeneratedThisYear: number;
  deficitImputableOnRevenuGlobal: number;  // Max 10,750€, from non-interest expenses
  deficitCarriedForward: number;  // To carry forward to next years
  breakdownPerProperty: PropertyResult[];
}

interface PropertyResult {
  propertyId: string;
  propertyName: string;
  grossIncome: number;
  totalExpenses: number;
  netIncome: number;              // Can be negative (déficit)
}
```

### 4.3 Key Calculation Functions to Implement

```typescript
// In lib/tax-calculator.ts

export function calculateMicroFoncier(properties: Property[]): MicroResult
export function calculateRegimeReel(properties: Property[], previousDeficits: PreviousDeficit[]): ReelResult
export function recommendRegime(microResult: MicroResult, reelResult: ReelResult): "micro" | "reel"
export function calculateTaxSavings(microResult: MicroResult, reelResult: ReelResult): number
export function runFullCalculation(input: TaxInputData): TaxCalculationResult
```

### 4.4 Test Scenarios

Include these exact scenarios as unit tests:

**Scenario A — Simple micro-foncier case:**
- 1 property, 6,000€ gross rent, 0€ expenses
- Expected: micro = 4,200€ taxable (6000 × 70%), micro recommended

**Scenario B — Régime réel wins:**
- 1 property, 12,000€ gross rent
- Expenses: 3,000€ interest + 2,000€ works + 1,200€ property tax + 600€ insurance = 6,800€
- Expected: réel = 5,200€ taxable (12000 - 6800), micro = 8,400€ taxable → réel recommended

**Scenario C — Déficit foncier:**
- 1 property, 8,000€ gross rent
- Expenses: 5,000€ interest + 6,000€ works = 11,000€
- Expected: Net foncier = -3,000€ (déficit)
- Interest portion = 5,000€ (but capped at actual deficit of 3,000€... check: deficit is 3,000€, of which 3,000€ < 5,000€ interest → all deficit is attributable to interest)
- Wait: correct calculation: Net = 8000 - 11000 = -3000€ deficit. Interest = 5000€, other = 6000€. Net without interest: 8000 - 6000 = 2000€ (positive). Deficit from interest: 8000 - 11000 + 6000 = -3000 + 6000... 
- Correct approach: Step 1: net without interest = 8000 - 6000 = 2000€. Step 2: apply interest: 2000 - 5000 = -3000€. The 2000€ portion of the interest absorbed income → the remaining 3000€ is the deficit. Since the deficit comes from interest only: 3000€ carries forward as interest portion (not deductible on revenu global). 0€ imputable on revenu global.

**Scenario D — Déficit imputable on revenu global:**
- 1 property, 8,000€ gross rent
- Expenses: 1,000€ interest + 12,000€ works = 13,000€
- Net without interest: 8000 - 12000 = -4000€. Apply interest: -4000 - 1000 = -5000€ total deficit.
- The -4000€ deficit comes from non-interest expenses → imputable on revenu global (under 10,750€ cap)
- The remaining -1000€ comes from interest → carry forward only
- Expected: 4000€ imputable on revenu global, 1000€ carried forward as interest portion

---

## 5. Multi-Step Wizard Specification

### Step 1 — Declaration Profile
Fields:
- Tax year (select: 2024, 2023, 2022)
- Number of rental properties (1–10, numeric input)
- Prior déficits: yes/no toggle
  - If yes: table to enter prior year deficits (year, interest portion, other portion)
  - Show tooltip explaining what a déficit foncier is

Validation:
- Tax year required
- At least 1 property required
- Prior déficit amounts must be >= 0

### Step 2 — Property Income
For each property (repeat per property count from Step 1):
- Property nickname (text, e.g., "Appart Lyon")
- Gross rent collected (€, required)
- Tenant charges recovered (€, optional, default 0)

Show running total of gross income across all properties.
Show eligibility banner: "Eligible au micro-foncier" if total < 15,000€.

### Step 3 — Property Expenses
For each property:
- Mortgage interest paid (€, 0 if no mortgage)
  - Tooltip: "Uniquement les intérêts, pas le remboursement du capital"
- Property management fees (€, 0 if self-managed)
- Landlord insurance / PNO (€)
- Property tax / Taxe foncière (€, excluding TEOM)
  - Tooltip: "Déduire la taxe d'enlèvement des ordures ménagères (TEOM) visible sur votre avis"
- Maintenance works (€)
  - Tooltip: "Travaux d'entretien uniquement. Les travaux d'amélioration ne sont pas déductibles."
- Condo fees (€, 0 if no co-ownership)
- Accounting fees (€, 0 if none)
- Other deductible expenses (€)

Show running total of expenses per property and globally.

### Step 4 — Simulation Results
This page shows the calculation results BEFORE payment.

Display:
- Recommended regime (large badge: "Régime Réel Recommandé" or "Micro-Foncier Recommandé")
- Savings with recommended regime (e.g., "Vous économisez 1,240€ d'impôts")
- Side-by-side comparison table:
  | | Micro-Foncier | Régime Réel |
  |---|---|---|
  | Revenu brut | X€ | X€ |
  | Déductions | -30% | -Y€ |
  | Revenu imposable | X€ | X€ |
  - Green highlight on the recommended column
- If déficit foncier: explain clearly what happens (imputed on revenu global / carried forward)
- CTA: "Générer mon formulaire 2044 — 49€" → goes to Step 5

### Step 5 — Payment & PDF Generation
- Pricing summary: "Déclaration {taxYear} — Offre Solo — 49€"
- Stripe checkout button
- On success: webhook updates user subscription, redirects to `/declaration/[id]/documents`
- Documents page shows:
  - PDF download button for formulaire 2044 pre-filled
  - PDF download button for the step-by-step guide
  - "Déclarer sur impots.gouv.fr" external link button

---

## 6. Pricing & Stripe Configuration

### Plans

| Plan | Price | Stripe Product ID | Features |
|---|---|---|---|
| Solo | 49€/year | `price_solo` | 1 tax year, up to 1 property |
| Multi | 89€/year | `price_multi` | 1 tax year, up to 5 properties |
| Pro | 149€/year | `price_pro` | 1 tax year, unlimited properties + priority support |

> Note: Pricing is per tax year. The user buys access to generate documents for one specific tax year.

### Stripe Webhook Events to Handle
- `checkout.session.completed` → mark declaration as paid, trigger PDF generation
- `payment_intent.payment_failed` → update declaration status, send failure email

---

## 7. PDF Generation Specification

### Formulaire 2044 Pre-filled PDF

The formulaire 2044 is the official French tax form for declaring revenus fonciers at régime réel.

Fields to pre-fill (map from calculation result):
- **Line 110**: Total gross rental income (column "Produits bruts")
- **Line 220**: Mortgage interest (Intérêts des emprunts)
- **Line 240**: Maintenance works (Travaux d'entretien)
- **Line 250**: Landlord insurance (Primes d'assurance)
- **Line 260**: Property tax (Taxes)
- **Line 270**: Management fees (Frais et charges de gestion)
- **Line 420**: Total deductible expenses (auto-sum)
- **Line 430**: Net foncier result (income - expenses)
- **Line 440**: Déficit imputable on revenu global (if negative)

**Implementation approach:**
- Use `@react-pdf/renderer` to build the form layout programmatically
- Style to look like the official cerfa form (grey headers, boxes, official fonts)
- Include user name, tax year, and declaration date in header

### Step-by-Step Guide PDF

A companion document (4–6 pages) that tells the user:
1. How to log in to impots.gouv.fr
2. How to navigate to "Mes revenus fonciers" in the 2042 form
3. Which box number to fill from the 2044 result (box 4BA for positive income, 4BB for déficit on revenu global)
4. Screenshots / diagrams of the impots.gouv.fr interface (placeholder boxes in MVP)

---

## 8. Authentication Specification

Use NextAuth.js v5 with:
- **Email/password** provider (CredentialsProvider) — primary auth method
- Email verification on signup (send via Resend)
- Password reset flow (forgot password → email link → reset form)
- Session strategy: JWT (not database sessions)

User roles:
- `user` — standard authenticated user
- `admin` — future use (skip in MVP)

Middleware: protect all `/dashboard`, `/declaration`, `/account` routes. Redirect unauthenticated users to `/login`.

---

## 9. Email Specification

Emails to implement (using Resend + React Email):

| Trigger | Email | Content |
|---|---|---|
| Register | Welcome email | Welcome + link to start first declaration |
| Payment success | Declaration ready | Download link, access instructions |
| Password reset | Reset password | Secure reset link (expires 1h) |
| 30 days before tax deadline | Reminder | "Votre déclaration approche" |

All emails: French language, simple layout, Flash Locatif branding (blue #1E5FA8).

---

## 10. SEO Specification

### Meta tags (all pages)
- `<title>` and `<meta name="description">` on every page
- Open Graph tags for social sharing
- Canonical URLs

### Key landing page SEO targets
- Primary keyword: "déclarer revenus fonciers formulaire 2044"
- Secondary: "régime réel ou micro-foncier calcul"
- Long-tail: "logiciel déclaration bailleur"

### Blog articles to create (stub pages in MVP)
1. "Micro-foncier ou régime réel : comment choisir ?" (slug: `micro-foncier-ou-regime-reel`)
2. "Comment remplir le formulaire 2044 étape par étape" (slug: `remplir-formulaire-2044`)
3. "Déficit foncier : comment ça marche et comment l'optimiser" (slug: `deficit-foncier`)
4. "Quelles charges sont déductibles en location nue ?" (slug: `charges-deductibles-location-nue`)

---

## 11. Component Library

### Colors (Tailwind config)
```javascript
// tailwind.config.ts
colors: {
  brand: {
    50: '#EBF3FB',
    100: '#D6E4F7',
    500: '#2E86C1',
    600: '#1E5FA8',
    700: '#174A82',
  },
  success: '#1A7A4A',
  warning: '#D4A017',
  error: '#C0392B',
}
```

### Typography
- Font: Inter (Google Fonts) — clean, modern, widely used in French SaaS
- Headings: font-bold, tight tracking
- Body: text-gray-700, 16px base

### Key Shared Components to Build
- `<Button variant="primary|secondary|ghost" size="sm|md|lg" />`
- `<Badge variant="success|warning|error|info" />`
- `<Card>` — white background, shadow-sm, rounded-xl
- `<StepProgress current={n} total={5} />` — for the wizard
- `<CurrencyInput>` — formatted input for euro amounts
- `<Tooltip>` — for tax explanations inline
- `<RegimeComparison>` — the side-by-side table in Step 4
- `<PricingCard>` — for the pricing section on landing page

---

## 12. Error Handling

- All API routes return `{ success: boolean, data?: T, error?: string }`
- HTTP status codes: 200 OK, 400 Bad Request (validation), 401 Unauthorized, 403 Forbidden, 500 Server Error
- Frontend: show toast notifications for errors (use `sonner` library)
- Log errors server-side (use `console.error` in MVP, swap for Sentry later)

---

## 13. Performance Requirements

- Lighthouse score > 90 on landing page
- First Contentful Paint < 1.5s
- All images: WebP format, next/image component with `priority` on hero image
- No layout shift (CLS < 0.1)

---

## 14. Security Requirements

- CSRF protection: NextAuth handles this
- Input sanitization: Zod on all API routes
- SQL injection: Prisma parameterized queries (automatic)
- Rate limiting on `/api/auth` routes (use `next-rate-limit` or middleware)
- HTTPS only (Vercel enforces this)
- No PII in client-side logs
