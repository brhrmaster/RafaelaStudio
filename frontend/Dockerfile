FROM node:23.11.1-slim as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

RUN npm install -g @angular/cli

COPY . .

RUN npm run build --prod

FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist/browser /usr/share/nginx/html
