FROM node:18.16.1-alpine3.17

WORKDIR /app

COPY /src .eslintrc.js .gitattributes .gitignore .prettierrc nest-cli.json package.json tsconfig.build.json tsconfig.json .env ./

RUN npm install

CMD ["npm", "run", "start:dev"]