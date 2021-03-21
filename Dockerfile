FROM node:12.16.1
WORKDIR /app
COPY . /app
EXPOSE 3000
RUN chmod +x /app/start.sh
CMD ["npm", "start"]