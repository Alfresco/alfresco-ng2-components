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

- Node base image (digest-pinned) with **pnpm** provisioned by Corepack from `package.json#packageManager`
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

### Verify it works

Run these inside the container terminal, from cheapest to most meaningful:

```bash
gh --version        # binary installed (no network/auth needed)
gh auth status      # confirms you are logged in and shows token scopes
gh api user --jq .login   # end-to-end: hits the API and prints your username
```

From within the checkout you can also confirm repo access:

```bash
gh repo view --json nameWithOwner --jq .nameWithOwner
# → Alfresco/alfresco-ng2-components
```

One-liner covering install + auth + API:

```bash
gh --version && gh auth status && gh api user --jq .login
```

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

### Manually importing your public key

If `git commit -S` fails with `gpg: signing failed: No secret key`, the forwarded
agent holds your **private** key but the container keyring is missing the matching
**public** key, so gpg can't locate it. Import it manually.

First, on the **host**, find your real key ID. On macOS, gpg is often `gpg2` and
may use a different keyring than plain `gpg`, so use the binary that actually holds
your keys:

```bash
gpg2 --list-secret-keys --keyid-format=long   # ID is the part after the '/' on the sec line
git config --global user.signingkey           # what git is set to sign with
```

Export that key on the **host** into the shared repo checkout (`.git/` is not
tracked, so it is a safe drop point):

```bash
# on the HOST — replace with your real key ID
gpg2 --armor --export <YOUR_KEY_ID> \
  > /Users/<you>/path/to/alfresco-ng2-components/.git/signing.pub
```

Import it in the **container** and point git at it:

```bash
# in the CONTAINER (repo root)
gpg --import .git/signing.pub && rm .git/signing.pub
git config --global user.signingkey <YOUR_KEY_ID>

# verify — a passphrase prompt (if any) appears on the HOST, not the container
gpg --list-secret-keys --keyid-format=long
echo test | gpg -u <YOUR_KEY_ID> --clearsign
git commit -S -m "test signed commit"
```

### Other signing gotchas

- `gpg-connect-agent 'keyinfo --list' /bye` printing **`connection to agent is in
  restricted mode`** is **normal and good** — VS Code forwards the host's restricted
  `gpg-agent.extra` socket, which allows signing but blocks key listing. It does not
  mean the agent is missing.
- Still failing after importing the public key? The forwarding didn't attach —
  on the host run `gpgconf --launch gpg-agent` and confirm `echo test | gpg2
  --clearsign` works there, then **Dev Containers: Rebuild Container**.
- Confirm `gnupg2` is present in the container: `gpg --version`.
- The automatic gitconfig / GPG / SSH forwarding is a feature of the **VS Code
  Dev Containers extension**. If you run this config via the plain
  `@devcontainers/cli`, you must mount `~/.gnupg`, `~/.gitconfig`, and the agent
  sockets yourself.

See [docs/dev-containers.md](../docs/dev-containers.md#git-operations-and-signing)
for alternative signing strategies (host-only signing, CI-enforced signing).
