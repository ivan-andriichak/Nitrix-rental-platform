#FROM node:20-alpine
#
#MAINTAINER Some Dev
#
#RUN mkdir /main
#WORKDIR /main
#
#COPY ./backend/package*.json /main
#
#RUN npm ci --only=production
#
#COPY ./backend /main
#
#
#EXPOSE 5000


FROM node:16

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]
