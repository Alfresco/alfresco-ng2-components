ARG VARIANT=24-bookworm
FROM mcr.microsoft.com/devcontainers/javascript-node:${VARIANT}

ARG PNPM_VERSION=11.5.0
ARG NX_VERSION=22.7.4

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PNPM_GLOBAL_BIN=/home/node/.local/share/pnpm/bin
ENV PATH=${PNPM_HOME}:${PNPM_GLOBAL_BIN}:${PATH}

# Configure Corepack-managed pnpm globally at image build time.
RUN corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate \
    && mkdir -p ${PNPM_HOME} ${PNPM_GLOBAL_BIN} \
    && chown -R node:node /home/node/.local \
    && su node -c "pnpm config set global-bin-dir ${PNPM_GLOBAL_BIN} && pnpm add --global nx@${NX_VERSION}"

USER node
