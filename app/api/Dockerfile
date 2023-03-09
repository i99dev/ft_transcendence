FROM node:19

WORKDIR /usr/src/app

RUN chown -R node:node .

USER node

CMD [ "sh", "-c", "yarn \
      && npx prisma migrate dev \
      && npx prisma studio | yarn dev \
    "]
