FROM node 
WORKDIR /app
COPY . . 
RUN yarn install && yarn build 
ENV MODE=container
EXPOSE 3000
CMD yarn start
