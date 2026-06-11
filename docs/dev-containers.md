# Dev Containers

This repository includes a Dev Container configuration to provide a consistent local development environment in VS Code.

## What It Provides

- Node-based development image defined in [.devcontainer/Dockerfile](../.devcontainer/Dockerfile)
- Workspace configuration in [.devcontainer/devcontainer.json](../.devcontainer/devcontainer.json)
- Pinned pnpm version via build arg and Corepack activation
- Non-root development user configuration (node)
- Persistent pnpm store volume for faster reinstall times

## Daily Workflow

1. Open the repository in VS Code.
2. Run Dev Containers: Rebuild and Reopen in Container when prompted (or from Command Palette).
3. Wait for the post-create step to finish package installation.
4. Work as usual: run tests, lint, and Nx targets from the integrated terminal.

Typical day-to-day actions:

- Rebuild after changing [.devcontainer/Dockerfile](../.devcontainer/Dockerfile) or [.devcontainer/devcontainer.json](../.devcontainer/devcontainer.json)
- Reopen in container after dependency or toolchain updates
- Keep local Docker Desktop running before opening the container

## Git Operations and Signing

You can use Git inside the container, outside the container, or split responsibilities for better key safety.

Recommended secure default:

1. Build, test, and edit code inside the container.
2. Create signed commits outside the container on the host machine.

This reduces exposure of signing keys to container processes while keeping day-to-day development reproducible.

### Option A: Sign Commits on Host (Recommended)

- Keep private signing keys only on the host.
- Do normal development in the container.
- Stage and commit from a host terminal in the same repository checkout.
- Run signed commit commands on host (for example, `git commit -S ...`).

Good fit when your policy requires strong key isolation.

### Option B: Commit and Sign in Container (With Care)

If your team prefers full in-container Git operations, use one of these approaches:

- Forward SSH agent into the container and use SSH signing.
- Forward GPG agent/socket into the container instead of copying private keys.
- Avoid storing raw private keys directly in container filesystems.

This keeps workflows convenient, but still requires careful host and container trust settings.

### Option C: Unsigned Commits in Container, Signed Merge in CI/Host

- Commit in container without local signing.
- Enforce signing at merge/release time using host or CI controls.

This can simplify local setup for contributors while preserving integrity checks in protected branches.

### Practical Daily Pattern

1. Code, lint, and test in the container.
2. Review and commit on host with signing enabled.
3. Push from host (or container) based on your credential policy.
4. Keep branch protection checks active (status checks, review, signature policy if used).

## Updating Base Image Safely

When updating the base image digest in [.devcontainer/Dockerfile](../.devcontainer/Dockerfile):

- Keep the FROM line digest-pinned for reproducibility
- Do not add an inline trailing comment on the same FROM line
- Put comments on separate lines above the FROM line

Why: some Docker/Buildx parser combinations can fail with:

FROM requires either one or three arguments

even when the digest itself is valid.

## Quick Troubleshooting

If container startup fails:

1. Verify Docker Desktop is running.
2. Build the Dockerfile directly to isolate parser/build issues.
3. Rebuild and Reopen in Container after fixes.

Useful files to inspect:

- [.devcontainer/devcontainer.json](../.devcontainer/devcontainer.json)
- [.devcontainer/Dockerfile](../.devcontainer/Dockerfile)
- VS Code Dev Containers logs under your local VS Code logs directory
