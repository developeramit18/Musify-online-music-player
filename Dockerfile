FROM node:18-alpine
WORKDIR /app

#copy only package files (for caching)

COPY package*.json ./

RUN npm install 

#copy full project

COPY . .

#build client

RUN npm install --prefix client 
RUN npm run build --prefix client

#Tell container PORT

EXPOSE 8000 

CMD ["npm", "start"]