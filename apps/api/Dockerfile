FROM node:22-bookworm-slim AS build

ENV DATABASE_URL=postgresql://folktuk:folktuk@localhost:5432/folktuk
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

COPY apps/api apps/api
RUN npm run prisma:generate --workspace @folktuk/api
RUN npm run build --workspace @folktuk/api
RUN npm prune --omit=dev

FROM node:22-bookworm-slim AS production

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/api/dist ./apps/api/dist

EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
