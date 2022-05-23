FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install
# RUN yarn ci --only=production


COPY . .

EXPOSE 3000

RUN ["yarn", "start"]