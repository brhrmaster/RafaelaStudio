FROM node:22.14.0

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY ./ .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start"]