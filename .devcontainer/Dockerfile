ARG VARIANT=24-bookworm
FROM mcr.microsoft.com/devcontainers/javascript-node:${VARIANT}

ARG PNPM_VERSION=11.5.0

# Configure Corepack-managed pnpm globally at image build time.
RUN corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate
