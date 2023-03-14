FROM node:19

WORKDIR /usr/src/app

RUN chown -R node:node .

USER node

# install dependencies
COPY --chown=node:node package.json yarn.lock ./
RUN yarn

CMD [ "sh", "-c", "yarn \
      && npx prisma migrate dev \
      && npx prisma studio | yarn dev \
    "]
    
