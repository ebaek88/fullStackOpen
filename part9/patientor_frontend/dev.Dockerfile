FROM node:24

WORKDIR /usr/src/app

COPY . .

ENV VITE_BACKEND_URL=http://localhost:3003

RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]