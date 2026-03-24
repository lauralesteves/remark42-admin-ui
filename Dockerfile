# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

ARG REACT_APP_API_URL
ARG REACT_APP_SITE_ID=remark

RUN npm run build

# Serve stage
FROM caddy:2-alpine

LABEL org.opencontainers.image.source="https://github.com/lauralesteves/remark42-admin-ui"
LABEL com.centurylinklabs.watchtower.enable="true"

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /srv

EXPOSE 80
