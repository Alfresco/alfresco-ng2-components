FROM mcr.microsoft.com/devcontainers/javascript-node@sha256:21b17a0c1fd000eff7280c9eea21f04779d1825531b144e400e5d028a0d967b1 # 24-bookworm

ARG PNPM_VERSION=11.5.0

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=${PNPM_HOME}:${PATH}

# Configure Corepack-managed pnpm globally at image build time.
RUN corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate \
    && mkdir -p ${PNPM_HOME} /home/node/.pnpm-store \
    && chown -R node:node /home/node/.local /home/node/.pnpm-store
USER node
