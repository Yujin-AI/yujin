FROM apify/actor-node-playwright-chrome:20 AS base

FROM base AS build

COPY --chown=node package*.json ./
RUN npm install --include=dev --audit=false
COPY --chown=node . ./

RUN npm run build
RUN ls -la

FROM base AS production
COPY --from=build --chown=node /home/node/build ./build

COPY --chown=node package*.json ./
RUN npm --quiet set progress=false && npm install --omit=dev --omit=optional && echo "Installed NPM packages:" && (npm list --omit=dev --all || true) && echo "Node.js version:" && node --version && echo "NPM version:" && npm --version
