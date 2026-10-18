FROM node:22-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install --legacy-peer-deps

FROM base AS build
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --omit=dev --legacy-peer-deps
COPY --from=build /app/.next ./.next
COPY --from=build /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "run", "start"]
