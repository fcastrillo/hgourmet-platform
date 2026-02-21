# SpecSeed Configuration

> Project-level settings that commands read at runtime.
> Edit this file to customize SpecSeed behavior for your project.

---

## Git Strategy

| Setting | Value | Options |
|:--------|:------|:--------|
| **mode** | `trunk` | `trunk` / `feature` |

- **`trunk`** (default): All commits go directly to `main`. Push happens at `@finish-objective`.
  Best for pre-deployment or projects without CI/CD auto-deploy.
- **`feature`**: Each `@start-objective` creates a branch `hu/N.M` from `main`.
  Commits stay on the branch during `@apply`. At `@finish-objective`, the branch is merged
  to `main` with `--no-ff`, pushed, and deleted. Best for projects with CD pipelines
  connected to `main` (Railway, Vercel, Netlify, etc.) where every push triggers a deploy.

---

## IDE Compatibility

| IDE | Entry Point | Commands |
|:----|:------------|:---------|
| **Cursor** | `.cursor/rules/specseed.mdc` | `@.spec/commands/X.md` |
| **Claude Code** | `CLAUDE.md` | `.claude/commands/` (symlinks to `.spec/commands/`) |
