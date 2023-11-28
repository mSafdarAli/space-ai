FROM node:16-alpine AS builder

WORKDIR /app

COPY . .

# RUN npm i && npm run build --prod

RUN npm i && npm run build:ssr


# Stage 2 Run with PM2

FROM node:16-alpine


RUN npm i -g pm2

WORKDIR /app

RUN mkdir dist

COPY --from=builder /app/dist /app/dist

CMD ["pm2-runtime", "dist/Space-Locator/server/main.js"]

# RUN pm2 start app/server/main.js

# FROM nginx:alpine

# RUN mkdir /app

# COPY --from=builder /app/dist/Space-Locator/browser /app

# COPY nginx.conf /etc/nginx/nginx.conf