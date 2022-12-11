FROM node:16 as builder

WORKDIR /app

RUN apt install make gcc g++ python

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3004

CMD ["npm", "run", "start:prod"]