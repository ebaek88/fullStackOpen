FROM node:24 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Vite replaces import.meta.env values during the build, so production config must be present before `npm run build`.
ARG VITE_BACKEND_URL=http://localhost:8080/api/
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

FROM nginx:1.29-alpine

# Production serves the built static files from Nginx; it does not run `vite dev`.
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
