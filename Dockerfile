FROM node:lts

WORKDIR /app

COPY ./ ./

RUN yarn

RUN npx @snaplet/seed generate

RUN yarn build

EXPOSE ${BACK_PORT}

CMD ["yarn", "start:prod"]
