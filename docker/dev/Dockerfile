FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node

# Install dependencies
COPY --chown=node:node ./package*.json ./
COPY --chown=node:node ./pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Copy the rest of the files
COPY --chown=node:node . .

# Start the development server
CMD ["pnpm", "dev"]
