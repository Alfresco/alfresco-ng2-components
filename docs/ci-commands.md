# CI Commands and Labels

Reference for flags and labels that control CI behavior on pull requests.

## PR Title Flags

Include these flags anywhere in the **PR title** to modify CI behavior.

| Flag | Effect |
|------|--------|
| `[ci:force]` | Skips the PR approval check, allowing the full pipeline to run without an approved review. Useful for testing CI changes on draft PRs. |

Example: `[AAE-12345] Fix pagination component [ci:force]`

## Commit Message Flags

Include these flags in a **commit message** to modify how Nx calculates affected projects.

| Flag | Effect |
|------|--------|
| `[affected:*]` | Forces all Nx targets to run against all projects, ignoring the affected calculation. Equivalent to `--all`. |

## PR Labels

Labels applied to the PR that affect CI behavior.

| Label | Effect |
|-------|--------|
| `do not merge` | Blocks the PR from passing the finalize check. CI will fail until the label is removed. |
| `next version` | Same as above - blocks the PR from merging. Used to hold PRs for the next release cycle. |

## Automatic Skip Conditions

The approval check is automatically skipped for:

- **Scheduled runs** (`schedule` event)
- **Workflow dispatch** (`workflow_dispatch` event)
- **Dependabot PRs** (actor is `dependabot[bot]`)
- **Build bot PRs** (actor is `alfresco-build`)
- **Devel flag** (when `devel: true` is passed via `workflow_call`)

## Path-Based Filtering

PRs that only modify non-code files skip the build, test, and lint jobs entirely. Files considered non-code:

- Markdown files (`*.md`)
- Documentation (`docs/`)
- `LICENSE`, `NOTICE`
- `.editorconfig`, `.gitattributes`
- `.github/CODEOWNERS`, `.github/dependabot.yml`

## PR Size Check

Every PR gets an automatic size classification displayed in the job summary:

| Size | Criteria |
|------|----------|
| **S** | < 200 total changes and < 10 files |
| **M** | 200-500 total changes or 10-20 files |
| **L** | 500-1000 total changes or 20-30 files |
| **XL** | > 1000 total changes or > 30 files (warning annotation added) |
