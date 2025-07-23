---
type: "always_apply"
---

# ICONS HERALD Augment Code Rulebook

**Version 1.0** (Created [Insert Date])  
**Project Overview**: ICONS HERALD is a premium, invitation-only digital archive platform with tiered profiles (Rising, Elite, Legacy), nomination flows, AI bio polishing, Razorpay payments, Supabase backend, and Next.js frontend. All code must align with the PRD (Product Requirements Document) for features like magic-link auth, ISR profiles, admin moderation, and editorial curation. Preserve core architecture: Next.js App Router for full-stack, Supabase for data/auth/storage, Chakra UI/Tailwind for UI.

This rulebook defines mandatory protocols for all AI-driven code generation, modification, and refactoring. Adherence is required to ensure safety, consistency, quality, and maintainability. If a user prompt conflicts with these rules, refuse and explain (see Section 1).

## Section 1: Meta-Rules & Core Directives
1. **Primacy of the Prompt with Safeguards**: Fulfill the user's most recent prompt, but if it violates a rule (e.g., security, data integrity, or functional degradation), refuse politely, cite the specific rule, and propose a compliant alternative. Example: "This change would expose API keys client-side, violating Section 8 Rule 2—suggest using a Next.js API route instead."
2. **Stateless Operation**: Treat each interaction as isolated—no memory of prior tasks. Base all actions on the current prompt, provided context, and readable project files.
3. **Rule Adherence Verification**: Before finalizing any response, internally confirm (and state in your output) that your proposal/output complies with all rules. If non-compliant, self-correct.
4. **Safety-First Principle**: All changes must be non-destructive—propose analyses/plans first (e.g., for refactors or deletions); await explicit user approval before implementing. No changes that degrade functionality per the PRD.
5. **Beginner-Friendly Outputs**: Explain all changes in simple terms; include comments in code for why something was added/fixed. Assume the user is a newbie—provide setup/run instructions (e.g., "Run `npm run dev` to test").

## Section 2: Project & Context Management
1. **Context Hygiene (Ignore Lists)**: Do not read or index files in `.gitignore` or a custom `.ai-ignore` (create one if missing, listing temp files, node_modules, build artifacts). Focus only on src/, app/, components/, lib/, etc.
2. **Temporary File Management**: For temp files (e.g., during testing), create them in a /tmp/ directory (add to .ai-ignore). Delete them before task completion; never commit temps to the repo.
3. **Allow List for Core Files**: Preserve these essential files unless justified (e.g., full refactor with approval). Propose deletions only if obsolete and non-impacting:
   - Core: /app/page.tsx (landing), /app/nominate/page.tsx, /app/builder/page.tsx, /app/admin/page.tsx, /app/profile/[slug]/page.tsx, /app/about/page.tsx, /app/process/page.tsx, /app/contact/page.tsx.
   - Components: /components/forms/* (e.g., NominationForm.tsx, ProfileBuilder.tsx), /components/templates/* (Rising/Elite/Legacy), /components/admin/* (tables, dashboards).
   - Lib: /lib/supabase/* (client/server), /lib/auth/*, /lib/validations/*, /lib/razorpay.ts.
   - API Routes: /app/api/* (e.g., payment/create-order, ai/polish-bio).
   - Config: next.config.js, tsconfig.json, .env.example, package.json.
   Justification required for any removal (e.g., "Superseded by new API route").
4. **File Size Limit & Proactive Refactoring**: No single file >500 lines of code (LOC). If a change would exceed this, halt, notify the user (cite this rule), propose a refactor (e.g., "Split /app/builder/page.tsx into components/builder/FormSection.tsx"), and await approval before proceeding.

## Section 3: Architecture & Design Patterns
1. **Full-Stack Separation**: Use Next.js App Router for both frontend (Client Components with 'use client') and backend (API routes, server actions). Business logic in /lib/ (e.g., Supabase queries); UI in /components/.
2. **Supabase Integration**: All data/auth/storage via Supabase (RLS for security—e.g., owner-only profile edits). Use edge functions for scheduled tasks (e.g., profile expirations). No direct DB access from client—route through API.
3. **Tiered Profiles & Dynamic Rendering**: Use JSONB for profile content; render via schema based on assigned_tier (conditional sections in templates). Support AI polishing in builder.
4. **UI Consistency**: Chakra UI for components, TailwindCSS for utilities; Framer Motion/Lenis for
