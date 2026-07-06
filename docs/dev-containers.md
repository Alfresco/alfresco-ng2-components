# Dev Containers

This repository includes a Dev Container configuration to provide a consistent local development environment in VS Code.

## What It Provides

- Node-based development image defined in [.devcontainer/Dockerfile](../.devcontainer/Dockerfile)
- Workspace configuration in [.devcontainer/devcontainer.json](../.devcontainer/devcontainer.json)
- pnpm provisioned by Corepack from `package.json#packageManager` (single source of truth)
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

## Running Nx Targets From the Workspace

From the repository root (inside the container terminal), run Nx targets with the package manager wrapper.

Common examples:

- `pn nx test <project>`
- `pn nx build <project>`

You can replace `<project>` with any workspace project name, for example `core`, `content-services`, or `process-services-cloud`.

Tip: to discover available projects and targets, run `pn nx show projects` and inspect each project's `project.json` (or workspace configuration).

## Nx Daemon and Graph Ports in Dev Containers

For this repository's VS Code Dev Container, Nx daemon is enabled (`NX_DAEMON=true`) to speed up repeated local Nx commands by keeping project graph state warm between runs.

Notes:

- Avoid forcing `CI=true` in day-to-day dev containers if you want daemon benefits.
- Keep `CI=true` for real CI pipelines and short-lived/ephemeral containers.
- If needed, disable daemon for a single command with `NX_DAEMON=false pn nx <target>`.

When running Nx commands, VS Code may show a notification about a port being opened by Nx Graph. This is expected when Nx serves the graph UI locally; it is typically a localhost-only temporary port used for visualization.

## Git Operations and Signing

The container is set up so you can do all Git work — including signed commits and
pushes — inside it, using your host credentials and settings. Your private keys
never enter the container: only the agent socket is forwarded.

### Option A: Commit and Sign in Container (Recommended)

The VS Code Dev Containers extension wires this up automatically:

- Your host `.gitconfig` (including `user.signingkey` and `commit.gpgsign`) is
  copied into the container.
- Your host `gpg-agent` is forwarded (this is why `gnupg2` is installed in the
  image), and your GPG public keys are imported into the container.
- Your host SSH agent is forwarded, so `git push` over SSH uses your host keys.

One-time host setup (this is what gets copied in):

```bash
git config --global user.signingkey <YOUR_KEY_ID>
git config --global commit.gpgsign true
```

Then work entirely inside the container:

```bash
gpg --list-secret-keys            # verify the forwarded key is visible
git commit -S -m "your message"   # -S optional when commit.gpgsign is true
git push
```

For rebuild-safe signing, export your public key into `.git/signing.pub` on the
host so the devcontainer can auto-import it on startup:

```bash
./.devcontainer/export-signing-key.sh
```

On Windows PowerShell:

```powershell
.\.devcontainer\export-signing-key.ps1
```

If you rotate keys, run the helper again before the next rebuild.

Expected behavior after rebuild:

- Signing keeps working when host forwarding/import and `.git/signing.pub` are in sync.
- If signing breaks after rebuild (especially after key rotation), regenerate `.git/signing.pub` with the helper and rebuild again.

If signing still fails, follow [Signing (GPG/PGP) Troubleshooting](#signing-gpgpgp-troubleshooting).

> Note: the automatic gitconfig / GPG / SSH forwarding is a feature of the VS Code
> Dev Containers extension. If you run this configuration via the plain
> `@devcontainers/cli`, mount `~/.gnupg`, `~/.gitconfig`, and the agent sockets
> yourself.

### Option B: Sign Commits on Host

Policy alternative for strongest key isolation:

- Keep private signing keys only on the host.
- Do development in the container, then commit from a host terminal.

### Option C: Unsigned Commits in Container, Signed Merge in CI/Host

Policy alternative for simpler contributor setup:

- Commit in container without local signing.
- Enforce signing at merge/release time in host/CI controls.

### Practical Daily Pattern

1. Code, lint, and test in the container.
2. Commit and sign in the container using the forwarded host keys.
3. Push from the container (SSH agent or `gh` credentials are forwarded).
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

### Signing (GPG/PGP) Troubleshooting

If `git commit -S` fails in the container:

1. Confirm host signing config:

	```bash
	git config --global user.signingkey
	git config --global commit.gpgsign
	```

2. Refresh the rebuild-safe public key file on the host:

	```bash
	./.devcontainer/export-signing-key.sh
	```

	Windows PowerShell:

	```powershell
	.\.devcontainer\export-signing-key.ps1
	```

3. Rebuild the container.

4. Verify inside container:

	```bash
	gpg --list-secret-keys --keyid-format=long
	git commit -S -m "test signed commit"
	```

5. If it still fails, restart host agent forwarding and rebuild:

	```bash
	gpgconf --launch gpg-agent
	echo test | gpg2 --clearsign
	```

Notes:

- `gpg-connect-agent 'keyinfo --list' /bye` reporting restricted mode is expected in Dev Containers.
- If you run via plain `@devcontainers/cli` instead of the VS Code extension, mount `.gnupg`, `.gitconfig`, and agent sockets manually.

### Nx Daemon Not Starting in Container

If `NX_DAEMON=true` is set but `pn nx daemon` still reports that the daemon is not running, Nx may have persisted a stale disable marker from a previous startup failure.

Recovery steps:

1. Reset Nx local state:

	```bash
	pnpm nx reset
	```

2. Run any Nx command to trigger daemon startup:

	```bash
	pnpm nx show projects
	```

3. Verify daemon status:

	```bash
	pnpm nx daemon
	```

4. If still not running, inspect logs:

	```bash
	cat .nx/workspace-data/d/daemon.log
	```

Notes:

- In Docker/dev containers, Nx disables daemon by default unless explicitly enabled.
- This repository enables it via `NX_DAEMON=true` in [.devcontainer/devcontainer.json](../.devcontainer/devcontainer.json).
