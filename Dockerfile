FROM node:23-alpine
LABEL authors="slamard"

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 60

CMD ["sh", "-c", "npm install && npm start"]
