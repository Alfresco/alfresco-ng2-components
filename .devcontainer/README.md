# Dev Container

Quick start for developing `alfresco-ng2-components` inside the VS Code Dev Container.
For the full guide (Nx targets, daemon, troubleshooting, base-image updates) see
[docs/dev-containers.md](../docs/dev-containers.md).

## Prerequisites

- Docker Desktop running
- VS Code with the **Dev Containers** extension (`ms-vscode-remote.remote-containers`)

## Getting Started

1. Open the repository in VS Code.
2. Run **Dev Containers: Reopen in Container** from the Command Palette (or accept the prompt).
3. Wait for the post-create step (`pnpm install --frozen-lockfile`) to finish.
4. Use the integrated terminal as usual, e.g. `pn nx test core`.

Rebuild (**Dev Containers: Rebuild Container**) after changing
[`Dockerfile`](./Dockerfile) or [`devcontainer.json`](./devcontainer.json).

## What's Included

- Node base image (digest-pinned) with Corepack-activated **pnpm**
- **Chromium** for Karma / `ChromeHeadless` tests (`CHROME_BIN` is preset)
- **GitHub CLI** (`gh`) via the `github-cli` dev container feature
- **gnupg2** so the host `gpg-agent` can be forwarded for signed commits
- Persistent pnpm store volume and warm Nx daemon (`NX_DAEMON=true`)

## GitHub CLI

`gh` is preinstalled. Authenticate once per container:

```bash
gh auth login
```

Or export a token instead: `export GH_TOKEN=<your-token>`.

## Signed Commits With Host Credentials

The VS Code Dev Containers extension handles this automatically — your private
keys never enter the container, only the agent socket is forwarded:

- Your host **`.gitconfig`** (including `user.signingkey` and `commit.gpgsign`)
  is copied into the container.
- Your host **`gpg-agent`** is forwarded (this is why `gnupg2` is installed), and
  your GPG **public** keys are imported into the container.
- Your host **SSH agent** is forwarded, so `git push` over SSH uses your host keys.

### One-time host setup

Make sure signing is configured on the **host** (this is what gets copied in):

```bash
git config --global user.signingkey <YOUR_KEY_ID>
git config --global commit.gpgsign true
```

Then, inside the container, verify the key is visible before committing:

```bash
gpg --list-secret-keys
git commit -S -m "your message"   # -S optional if commit.gpgsign is true
git push
```

### If signing fails

- Getting `error: gpg failed to sign the data` / `no secret key`? The agent
  forwarding didn't attach — **Rebuild Container** or reload the VS Code window.
- Confirm `gnupg2` is present: `gpg --version`.
- The automatic gitconfig / GPG / SSH forwarding is a feature of the **VS Code
  Dev Containers extension**. If you run this config via the plain
  `@devcontainers/cli`, you must mount `~/.gnupg`, `~/.gitconfig`, and the agent
  sockets yourself.

See [docs/dev-containers.md](../docs/dev-containers.md#git-operations-and-signing)
for alternative signing strategies (host-only signing, CI-enforced signing).
