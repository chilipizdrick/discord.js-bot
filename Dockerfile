FROM node:18.17.0

WORKDIR /app

COPY package*.json ./

RUN npm run build

COPY . .

RUN npm run deploy-commands

CMD [ "npm", "start" ]