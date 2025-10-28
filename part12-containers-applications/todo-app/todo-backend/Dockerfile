FROM node:22

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci --omit=dev

ENV DEBUG=todo-backend:*

USER node

CMD npm start