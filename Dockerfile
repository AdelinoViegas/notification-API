FROM node:22
WORKDIR /app
COPY . . 
RUN yarn install 
RUN yarn build 
CMD yarn start
EXPOSE 3000