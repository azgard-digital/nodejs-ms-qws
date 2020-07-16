FROM node:12.16.1
WORKDIR /app
COPY . /app
RUN npm install
RUN node /app/migrate.js
EXPOSE 3000
CMD ["npm", "start"]