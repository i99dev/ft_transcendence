FROM node:19

WORKDIR /usr/src/app

RUN chown -R node:node .

USER node

CMD [ "sh", "-c", "yarn && yarn dev"]
