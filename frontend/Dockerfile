FROM node:22.14.0 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

RUN npm install -g @angular/cli

COPY . .

RUN npm run build --prod

FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist/browser /usr/share/nginx/html
