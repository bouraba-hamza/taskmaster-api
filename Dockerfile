### Multi-stage Dockerfile for production (bundled artifact)
# Build stage: install dev deps and bundle with esbuild
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run bundle

# Runtime stage: run the bundled artifact only (no devDependencies)
FROM node:22-slim AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
# We intentionally do NOT run npm ci here to avoid installing devDependencies or node_modules.
# The bundled artifact in /app/dist is expected to be self-contained for runtime.
EXPOSE 3000
CMD ["node", "dist/index.js"]
