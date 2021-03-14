FROM node:12
EXPOSE 80
WORKDIR /usr/src/app

COPY dist .
COPY package.json .
COPY .npmrc .
RUN npm install

CMD ["node", "index.js"]
