# SpecSeed Roadmap

> Deferred improvements and future enhancements for the SpecSeed framework.
> Items here were identified during planning sessions but deferred intentionally.

---

## Version History

| Version | Date | Highlights |
|:--------|:-----|:-----------|
| `0.1.0` | 2026-01-xx | Initial release: constitution, 7 commands, trunk-based git |
| `0.3.0` | 2026-02-20 | Git strategy configurable (trunk/feature), deviation analysis with ADR escalation, multi-IDE support (Cursor + Claude Code), VERSION marker, adopt.sh for existing projects, validate.md usage guide |

---

## Deferred: `@upgrade` Command

**Priority:** Implement when 2+ repos are using SpecSeed.

**Problem:** When SpecSeed evolves (new commands, constitution changes, template updates),
existing repos that used an older version remain outdated.

**Proposed Solution:**

1. Create `.spec/commands/upgrade.md` that:
   - Reads `.spec/VERSION` from the local project.
   - Accepts the path to the SpecSeed template repo (or clones it temporarily).
   - Compares versions and lists changes between them.
   - Applies updates ONLY to framework files:
     - `.spec/commands/`
     - `.spec/templates/`
     - `.spec/constitution.md`
     - `.spec/config.md`
     - `.cursor/rules/`
     - `CLAUDE.md`
     - `.claude/commands/` (regenerate symlinks)
   - NEVER touches project files:
     - `docs/PRD.md`, `docs/TECH_SPEC.md`, `docs/BACKLOG.md`, `docs/CHANGELOG.md`
     - `.spec/history/`, `.spec/work/`
     - `current_objective.md`
   - Updates `.spec/VERSION` to the new version.

2. Maintain a CHANGELOG for the SpecSeed framework itself (in the template repo).

3. `init.sh` already writes the version to `.spec/VERSION` at project creation time.

**Trigger:** When a second project is initialized with SpecSeed.

---

## Deferred: Retrospective Analytics

**Priority:** Low — nice-to-have after accumulating 10+ completed objectives.

**Problem:** The `.spec/history/` folder accumulates completed objectives with deviation data,
but there is no command to analyze patterns across objectives.

**Proposed Solution:**

1. Create `.spec/commands/retro.md` that:
   - Reads all files in `.spec/history/`.
   - Aggregates deviation data (most common deviation types, recurring decisions, etc.).
   - Identifies patterns: which tasks are consistently underestimated, which types of decisions
     recur, which lessons keep being learned.
   - Presents a summary to the user.

2. This is NOT a per-objective retrospective (that's handled by the deviation analysis in
   `@finish-objective`). This is a cross-objective trend analysis.

**Trigger:** When `.spec/history/` contains 10+ completed objectives.

---

## Deferred: Session Persistence / Handoff

**Priority:** Low — evaluate after testing multi-IDE workflow.

**Problem:** When switching between Cursor and Claude Code mid-objective, the new IDE session
has no context about what the previous session accomplished.

**Proposed Solution:**

The `current_objective.md` already serves as the handoff document (tasks marked with completion
status). No additional mechanism is needed as long as `@apply` keeps `current_objective.md`
up to date after each task.

**Decision:** Monitor during real usage. If `current_objective.md` proves insufficient for
handoff, consider adding a `.spec/work/FEAT-N/HU-N.M/session-log.md` that captures
per-task notes.

---

## Deferred: Custom Command Support

**Priority:** Low — evaluate based on user feedback.

**Problem:** Advanced users may want to create project-specific commands beyond the 7 standard
ones (e.g., `@deploy`, `@seed-data`, `@generate-types`).

**Proposed Solution:**

1. Support a `.spec/commands/custom/` directory for project-specific commands.
2. These would NOT be overwritten by `@upgrade`.
3. Document the command format (trigger, pre-conditions, steps, output, post-conditions).

**Trigger:** When a concrete use case arises.
