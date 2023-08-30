FROM node:16-alpine

WORKDIR /usr/src/app

RUN npm i -g @nestjs/cli

COPY package*.json ./

RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env cat /etc/secrets/.env

RUN npm install

COPY . .

ENV API_PORT=10000
ENV NODE_ENV=PROD

EXPOSE 10000

RUN npm run build

CMD [ "npm", "run", "start:prod" ]
