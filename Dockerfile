FROM node:lts

WORKDIR /app

COPY ./ ./

RUN yarn

RUN yarn prisma generate

RUN yarn build

EXPOSE ${PORT}

EXPOSE 5555

CMD ["yarn", "start:dev"]
