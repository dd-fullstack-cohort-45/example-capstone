FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:20-alpine AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY .env.production ./.env.production

RUN chown node:node -R ./
USER node


EXPOSE 3000
CMD ["npm", "start"]