FROM node:20-alpine

WORKDIR /app

RUN npm install -g expo

COPY package.json ./

RUN npm install --legacy-peer-deps
RUN npm i --save-dev @types/node

COPY . .

EXPOSE 8081 19000 19001 19002 19006

CMD ["npm", "start"]
