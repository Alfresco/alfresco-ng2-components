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

The VS Code Dev Containers extension handles part of this automatically — your
private keys never enter the container, only the agent socket is forwarded:

- Your host **`.gitconfig`** (including `user.signingkey` and `commit.gpgsign`)
  is copied into the container.
- Your host **`gpg-agent` socket** is forwarded (this is why `gnupg2` is
  installed). This enables the actual signing operation via the host agent.
- Your host **SSH agent** is forwarded, so `git push` over SSH uses your host keys.

**Important**: VS Code forwards the host agent socket but does **not** automatically
copy your host GPG public keyring into the container. GPG requires both a public key
entry in the container's local keyring (to select the key) and the forwarded agent
(to perform the signing). Without the public key, `gpg --clearsign` fails with
`No secret key` even though the host agent connection is active.

### One-time host setup

1. Configure signing on the host:

   ```bash
   git config --global user.signingkey <YOUR_KEY_ID>
   git config --global commit.gpgsign true
   ```

2. Export your public key so the container can import it:

   ```bash
   # on the HOST, from repo root (auto-uses git user.signingkey)
   ./.devcontainer/export-signing-key.sh

   # or pass a key explicitly
   ./.devcontainer/export-signing-key.sh <YOUR_KEY_ID>
   ```

   On Windows PowerShell, use:

   ```powershell
   # on the HOST, from repo root (auto-uses git user.signingkey)
   .\.devcontainer\export-signing-key.ps1

   # or pass a key explicitly
   .\.devcontainer\export-signing-key.ps1 <YOUR_KEY_ID>
   ```

3. Rebuild the container. The `postStartCommand` auto-imports `.git/signing.pub`
   on every container start, so signing survives restarts and rebuilds without
   re-running the export script.

The helper auto-selects `gpg2`/`gpg` based on where your key is visible, which
avoids host setups where the two binaries use different keyrings.

If you rotate keys, run the export helper again on the host before the next rebuild.

Expected behavior after rebuild:

- Signing keeps working when host forwarding/import and `.git/signing.pub` are in sync.
- If signing breaks after rebuild (especially after key rotation), regenerate `.git/signing.pub` with the helper and rebuild again.

After **Rebuild Container** (or next container start), verify in the container:

```bash
gpg --list-secret-keys --keyid-format=long
git commit -S -m "test signed commit"
```

### Other signing gotchas

- `gpg-connect-agent 'keyinfo --list' /bye` printing **`connection to agent is in
  restricted mode`** is **normal and good** — VS Code forwards the host's restricted
  `gpg-agent.extra` socket, which allows signing but blocks key listing. It does not
  mean the agent is missing.
- If signing fails after a rebuild, regenerate `.git/signing.pub` on the host with
  `./.devcontainer/export-signing-key.sh` (or
  `./.devcontainer/export-signing-key.ps1` on PowerShell) and rebuild again.
- If it still fails, the forwarding likely did not attach — on the host run
  `gpgconf --launch gpg-agent` and confirm `echo test | gpg2 --clearsign` works,
  then **Dev Containers: Rebuild Container**.
- Confirm `gnupg2` is present in the container: `gpg --version`.
- The automatic gitconfig / GPG / SSH forwarding is a feature of the **VS Code
  Dev Containers extension**. If you run this config via the plain
  `@devcontainers/cli`, you must mount `~/.gnupg`, `~/.gitconfig`, and the agent
  sockets yourself.

For a full troubleshooting checklist, see
[docs/dev-containers.md](../docs/dev-containers.md#signing-gpgpgp-troubleshooting).

See [docs/dev-containers.md](../docs/dev-containers.md#git-operations-and-signing)
for alternative signing strategies (host-only signing, CI-enforced signing).
