FROM node:lts

WORKDIR /app

COPY ./ ./

RUN yarn

RUN npx @snaplet/seed generate

RUN yarn build

EXPOSE ${BACK_PORT}

EXPOSE 5555

CMD ["yarn", "start:dev"]
