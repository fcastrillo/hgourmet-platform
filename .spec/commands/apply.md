# @apply

> Execute the implementation plan from `current_objective.md` using TDD discipline.

---

## Trigger

The user invokes this command after the plan in `current_objective.md` has been approved.

**Usage:** `@apply` (no arguments — reads from `current_objective.md`)

---

## Pre-conditions

1. Read `.spec/constitution.md` to load operating principles.
2. Read `.spec/config.md` to determine `git_strategy` (trunk or feature).
3. Read `current_objective.md` — it **must** contain a validated plan. If empty or missing,
   **STOP and instruct the user to run `@start-objective` first.**
4. Read `docs/TECH_SPEC.md` for technical standards.
5. Confirm the plan has been approved by the user.
6. If `feature` mode: verify you are on the correct `hu/N.M` branch.

---

## Role Activation

Switch to **Senior Fullstack Developer** mode. You are now writing production code.

- Write **complete, working implementations** — not pseudocode or high-level abstractions.
- Follow the project's `TECH_SPEC.md` stack and conventions exactly.
- Handle edge cases, loading states, error boundaries, and validation.
- If using Supabase: write real SQL migrations, real RLS policies, real TypeScript types.
- If building UI: produce accessible, responsive components with proper state management.
- If writing API logic: include proper error handling, input validation, and type safety.

---

## Steps

### Step 1: Database First (if applicable)

If `current_objective.md` includes a "Database Changes" section:

1. Generate the SQL migration file.
2. Include RLS policies.
3. Present the SQL to the user for review before proceeding.

### Step 2: Execute Tasks in TDD Order

For each task in the implementation plan:

#### RED Phase
1. Read the BDD criterion associated with this task.
2. Translate it into a failing test:
   - Integration test for data/API logic.
   - Component test for UI behavior.
3. Verify the test fails (it must fail — this confirms the test is meaningful).

#### GREEN Phase
1. Write the **minimum** code to make the test pass.
2. Follow the component classification from the plan (`[SC]`, `[CC]`, `[SA]`).
3. Run the test — it must pass.

#### REFACTOR Phase
1. Clean up code without changing behavior.
2. Ensure naming conventions match `docs/TECH_SPEC.md` standards.
3. Run all tests — they must still pass.

### Step 3: Commit and Update Progress

After completing each task (GREEN + REFACTOR done):

1. **Commit** the changes following the constitution's git convention:
   ```bash
   git add -A
   git commit -m "feat(HU-N.M): [short description of what this task accomplished]"
   ```
   Use `fix(HU-N.M):` if the task was a bug fix, or `perf(HU-N.M):` for performance work.

2. **Update** `current_objective.md`:
   ```markdown
   ### Task 1: [Description] ✅
   - **Cycle:** RED ✅ → GREEN ✅ → REFACTOR ✅
   - **Files modified:** [actual list]
   - **Commit:** [short hash]
   ```

### Step 4: Manual Testing

Once all tasks are complete, guide the user through the Manual Testing Checklist
from `current_objective.md`.

### Step 5: Summary

```
=== APPLY COMPLETE ===
Objective: HU-N.M — [Title]
Tasks completed: N/N
Tests passing: [count]
Files modified: [list]

Next step: Run @finish-objective to archive and update the backlog.
```

---

## Output

| Artifact | Content |
|:---------|:--------|
| Test files | Failing → Passing tests per BDD criterion |
| Source files | Implementation code (components, actions, etc.) |
| Migration files | SQL for Supabase (if applicable) |
| `current_objective.md` | Updated with completion markers |

---

## Post-conditions

- All BDD criteria have associated passing tests.
- No TypeScript/linter errors in modified files.
- `current_objective.md` reflects all tasks as completed.
- The user has verified the manual testing checklist.
- Every completed task has a corresponding git commit with `feat(HU-N.M):` convention.

---

## Rules

- **Never skip the RED phase.** A test must fail before you write implementation code.
- **Never modify files outside the plan** without explicit user approval.
- **If a task takes longer than estimated**, pause and inform the user.
- **If you discover a missing spec**, stop and suggest running `@validate`.
