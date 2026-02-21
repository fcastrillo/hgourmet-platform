# Objective: HU-N.M — [Story Title]

## Context

- **Feature:** FEAT-N — [Feature Name]
- **Story:** Como [rol], quiero [acción], para poder [resultado]
- **Spec Level:** [Minimal | Lite | Standard | Full]
- **Estimated Duration:** [total time estimate]

## Acceptance Criteria (BDD)

### Scenario 1: [Name]

- **Dado que:** [context]
- **Cuando:** [action]
- **Entonces:** [result]

### Scenario 2: [Name]

- **Dado que:** [context]
- **Cuando:** [action]
- **Entonces:** [result]

### Scenario 3: [Error case]

- **Dado que:** [context]
- **Cuando:** [action]
- **Entonces:** [result]

## Implementation Plan

### Task 1: [Description] (~XX min)

- **Type:** [SC] | [CC] | [SA] | [DB] | [TEST]
- **Cycle:** RED → GREEN → REFACTOR
- **Files:** [list of files to create/modify]
- **Verification:** [specific command to validate]

### Task 2: [Description] (~XX min)

- **Type:** [SC] | [CC] | [SA] | [DB] | [TEST]
- **Cycle:** RED → GREEN → REFACTOR
- **Files:** [list of files to create/modify]
- **Verification:** [specific command to validate]

## Database Changes

> Remove this section if no DB changes are needed.

```sql
-- Migration: [description]
-- Tables affected: [list]

-- [SQL statements here]
```

## Manual Testing Checklist

- [ ] [Step 1: What to do and what to verify]
- [ ] [Step 2: What to do and what to verify]
- [ ] [Step 3: What to do and what to verify]

## Definition of Done

- [ ] All BDD criteria have passing tests
- [ ] No TypeScript errors
- [ ] RLS policies tested (if applicable)
- [ ] Manual testing checklist verified
- [ ] CHANGELOG entry drafted

---

> The following sections are filled automatically by `@finish-objective`.

## Completion

- **Date:** [filled at close]
- **Estimated Duration:** [copied from Context]
- **Actual Duration:** [computed from git: first `feat(HU-N.M)` commit to closing commit]
- **Variance:** [over/under estimate and ratio, e.g. "3x faster than estimated"]
- **Files modified:** [filled at close]
- **Tests added:** [filled at close]

## Deviations & Decisions

- **Added:** [unplanned tasks/files, or "None"]
- **Changed:** [tasks that changed scope, or "None"]
- **Skipped:** [omitted tasks and reason, or "None"]
- **Key Decisions:** [decisions made during implementation]
- **Escalated ADRs:** [ADR-00N reference if applicable, or "None"]
- **Lesson:** [one-line takeaway for future objectives, if applicable]
