# Base image pinned by digest for reproducible devcontainer builds.
# Important: keep this FROM line comment-free (no inline trailing comment),
# or some Docker/Buildx versions can fail to parse it.
FROM mcr.microsoft.com/devcontainers/javascript-node@sha256:21b17a0c1fd000eff7280c9eea21f04779d1825531b144e400e5d028a0d967b1

ARG PNPM_VERSION=11.5.3

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=${PNPM_HOME}:${PATH}

# Install Chromium for Karma/ChromeHeadless test execution inside the container.
RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium \
    && rm -rf /var/lib/apt/lists/*

# Configure Corepack-managed pnpm globally at image build time.
RUN corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate \
    && mkdir -p ${PNPM_HOME} /home/node/.pnpm-store \
    && chown -R node:node /home/node/.local /home/node/.pnpm-store
USER node
