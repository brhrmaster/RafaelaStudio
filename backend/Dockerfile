FROM node:23.11.1-slim

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY ./ .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start"]