# @spec-init

> Bootstrap a new project by generating the foundational specification documents.

---

## Trigger

The user invokes this command at the very start of a new project, providing a brief
description of what they want to build.

**Usage:** `@spec-init` + project description in natural language.

---

## Pre-conditions

1. The `.spec/` folder structure exists (run `scripts/init.sh` first or verify manually).
2. `docs/PRD.md` and `docs/TECH_SPEC.md` are either empty or contain only template placeholders.
3. Read `.spec/constitution.md` to load the operating principles.

---

## Steps

### Step 1: Gather Context

Read the user's project description carefully. If any of the following are unclear, **ask before
proceeding**:

- What problem does this product solve?
- Who are the target users (at least 2 roles/personas)?
- What is the desired tech stack? (Default: Next.js + Supabase + TailwindCSS + Vercel)
- What is explicitly OUT of scope for the MVP?

### Step 2: Generate `docs/PRD.md`

Using the template in `.spec/templates/`, fill in:

- **Vision:** One-paragraph product purpose.
- **Users:** At least 2 personas with roles and goals.
- **MVP Scope:** Explicit IN/OUT lists.
- **KPIs:** At least 1 measurable success indicator.
- **Initial Feature List:** High-level FEAT-N identifiers with one-line descriptions.

### Step 3: Generate `docs/TECH_SPEC.md`

Using the template, fill in:

- **Stack:** Framework, DB, UI library, language, hosting.
- **Data Model:** Initial list of core tables with key columns.
- **Authentication:** Access method (e.g., OTP via Email, OAuth).
- **Security (RLS):** Who can read/write which entities.
- **Architecture Decisions:** Any non-obvious choices (ADRs).
- **Server/Client Strategy:** Default to Server Components; document exceptions.

### Step 4: Initialize `docs/BACKLOG.md`

Create the initial backlog structure with:

- The Features identified in Step 2, each with a placeholder Benefit Hypothesis.
- No User Stories yet (those come with `@start-feature`).

### Step 5: Summary

Present a summary to the user:

```
=== SPEC-INIT COMPLETE ===
Project: [Name]
Documents generated:
  - docs/PRD.md (Vision + MVP Scope)
  - docs/TECH_SPEC.md (Stack + Data Model)
  - docs/BACKLOG.md (Initial Feature list)

Next step: Run @start-feature FEAT-1 to detail the first Feature.
```

---

## Output

| File | Content |
|:-----|:--------|
| `docs/PRD.md` | Product vision, users, scope, KPIs |
| `docs/TECH_SPEC.md` | Stack, data model, auth, security |
| `docs/BACKLOG.md` | Initial hierarchical backlog |

---

## Post-conditions

- All three documents pass the `@validate` schema for their respective levels.
- No `[NEEDS CLARIFICATION]` tags remain in the generated documents.
- The user has reviewed and approved the outputs before proceeding.
