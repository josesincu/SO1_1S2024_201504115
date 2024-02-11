FROM node:20.11.0

WORKDIR /api
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 4000
CMD ["node", "index.js"]
#RUN npm run build



#CMD ["node", "index.js", "--host"]