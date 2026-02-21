# @finish-objective

> Close the current objective, archive the work, and update the backlog and changelog.

---

## Trigger

The user invokes this command after `@apply` has been completed and all tests pass.

**Usage:** `@finish-objective` (no arguments — reads from `current_objective.md`)

---

## Pre-conditions

1. Read `.spec/constitution.md` to load operating principles.
2. Read `.spec/config.md` to determine `git_strategy` (trunk or feature).
3. Read `current_objective.md` — all tasks must be marked as completed.
4. Read `docs/BACKLOG.md` to locate the Story being closed.
5. Read `docs/CHANGELOG.md` to append the new entry.

---

## Steps

### Step 1: Verify Completion

Check that `current_objective.md` has:

- [ ] All tasks marked with ✅
- [ ] All BDD criteria covered by passing tests
- [ ] Manual testing checklist completed

**If any item is incomplete, STOP and inform the user.**

### Step 2: Deviation Analysis

Compare the **original plan** in `current_objective.md` against what actually happened:

1. **Gather evidence:**
   - Read `current_objective.md` (planned tasks, files, and estimates).
   - Run `git log --oneline` from the first commit of this objective to HEAD.
   - Identify all files modified via `git diff --stat` against the commit before the objective started.

2. **Identify deviations:**
   - **Added:** Tasks or files that were NOT in the original plan but were implemented.
   - **Changed:** Tasks whose scope, approach, or files differed from the plan.
   - **Skipped:** Planned tasks that were omitted (and why).
   - **Key Decisions:** Technical decisions made during implementation that diverged from the plan or were not anticipated.

3. **Classify each deviation:**
   - **Tactical** (affects only this HU) — stays in the archived history file.
   - **Architectural** (introduces a pattern, convention, or technology choice that affects
     future stories) — **propose to the user** to escalate it as an ADR in `docs/TECH_SPEC.md`.

4. **ADR Escalation (if applicable):**
   - If the user approves, add a new `ADR-00N` entry in `docs/TECH_SPEC.md` under
     "Architecture Decisions (ADRs)" with:
     ```markdown
     ### ADR-00N: [Decision Title]
     - **Context:** [Why this decision was needed]
     - **Decision:** [What was decided]
     - **Consequences:** [Trade-offs and implications]
     - **Origin:** HU-N.M (discovered during implementation)
     ```

5. **If there are no deviations**, note "No deviations from plan" and proceed.

### Step 3: Archive the Objective

1. Copy `current_objective.md` to `.spec/history/` with the naming convention:
   ```
   .spec/history/YYYY-MM-DD_HU-N.M_completed.md
   ```
2. Add the following sections at the end of the archived file:
   ```markdown
   ## Completion
   - **Date:** YYYY-MM-DD
   - **Duration:** [estimated total time]
   - **Files modified:** [list]
   - **Tests added:** [count]

   ## Deviations & Decisions
   - **Added:** [unplanned tasks/files, or "None"]
   - **Changed:** [tasks that changed scope, or "None"]
   - **Skipped:** [omitted tasks and reason, or "None"]
   - **Key Decisions:** [decisions made during implementation]
   - **Escalated ADRs:** [ADR-00N reference if applicable, or "None"]
   - **Lesson:** [one-line takeaway for future objectives, if applicable]
   ```

### Step 4: Update `docs/BACKLOG.md`

Mark the Story as completed:

```markdown
- [x] HU-N.M: [Story title] ✅ (YYYY-MM-DD)
```

If all Stories in a Feature are complete, mark the Feature as delivered.

### Step 5: Update `docs/CHANGELOG.md`

Add a new entry following the benefit-oriented format:

```markdown
## [YYYY-MM-DD] — HU-N.M: [Story Title]

**Feature:** FEAT-N — [Feature Name]
**Benefit:** [What value was delivered to the user]
**Changes:**
- [Summary of what was built/changed]
**Tests:** [Number of tests added]
```

### Step 6: Git — Closing Commit, Merge, and Tags

1. **Stage and commit** all documentation changes (archive, BACKLOG, CHANGELOG, TECH_SPEC if ADR added):
   ```bash
   git add -A
   git commit -m "docs(HU-N.M): close objective"
   ```

2. **If `feature` mode** — merge the branch to `main`:
   ```bash
   git checkout main
   git merge --no-ff hu/N.M -m "feat(HU-N.M): merge story branch"
   git branch -d hu/N.M
   ```
   If `trunk` mode — skip this step (already on `main`).

3. **Tag the Story** as completed:
   ```bash
   git tag HU-N.M
   ```

4. **If this was the last Story in the Feature**, also tag the Feature:
   ```bash
   git tag FEAT-N
   ```

5. **Push** commits and tags to remote:
   ```bash
   git push && git push --tags
   ```

### Step 7: Reset `current_objective.md`

Replace the contents with the empty placeholder:

```markdown
# Current Objective

> No active objective. Run `@start-objective HU-N.M` to begin.
```

### Step 8: Summary

```
=== OBJECTIVE CLOSED ===
Story: HU-N.M — [Title]
Archived to: .spec/history/YYYY-MM-DD_HU-N.M_completed.md
Deviations: [count] tactical, [count] architectural (escalated to ADR)
BACKLOG: Updated ✅
CHANGELOG: Updated ✅
Git: Committed + Tagged (HU-N.M) + Pushed ✅

Next step:
  - More stories in this Feature? → @start-objective HU-N.X
  - New Feature? → @start-feature FEAT-X
  - Done for today? → Great work! 🎯
```

---

## Output

| File | Content |
|:-----|:--------|
| `.spec/history/YYYY-MM-DD_HU-N.M_completed.md` | Archived objective with completion metadata + deviations |
| `docs/BACKLOG.md` | Story marked as completed |
| `docs/CHANGELOG.md` | New benefit-oriented entry |
| `docs/TECH_SPEC.md` | New ADR entry (only if architectural deviation escalated) |
| `current_objective.md` | Reset to empty placeholder |

---

## Post-conditions

- The objective is archived with full traceability and deviation analysis.
- Tactical deviations are documented in the history file.
- Architectural deviations are escalated to ADRs in `docs/TECH_SPEC.md` (with user approval).
- `docs/BACKLOG.md` reflects the current state of progress.
- `docs/CHANGELOG.md` has a new entry tied to delivered value.
- `current_objective.md` is clean and ready for the next objective.
- All changes are committed, tagged (`HU-N.M`), and pushed to remote.
- If the Feature is complete, it is also tagged (`FEAT-N`).
