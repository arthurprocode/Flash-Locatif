# Flash Locatif

> Automatisez votre déclaration de revenus fonciers en 10 minutes.

## Getting Started with Claude Code

This project is designed to be built with Claude Code.

### Setup

1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Open a terminal in this folder
3. Run: `claude`

### How to build this project

Tell Claude Code:

```
Read CLAUDE.md and prompt_plan.md. Find the first uncompleted task, implement it fully, run typecheck and lint, mark it done, then wait for my review.
```

Repeat for each task until done.

### Files

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project context — Claude reads this every session |
| `SPEC.md` | Full product spec — reference for what to build |
| `prompt_plan.md` | Ordered task checklist — the build roadmap |

### Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL (Supabase)
- NextAuth.js v5
- Stripe payments
- @react-pdf/renderer
- Resend (emails)
- Vercel (hosting)
