FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV SERVER_PORT=3005

EXPOSE 3005
EXPOSE 3306

CMD ["npm", "start"]