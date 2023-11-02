FROM node:18.16.1-alpine3.17

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:dev", "--", "--host", "0.0.0.0"]


# ! Sin el docker
# FROM node:18.16.1-alpine3.17

# WORKDIR /app

# COPY . .

# RUN npm install

# RUN npm run build

# EXPOSE 3001

# CMD ["npm", "run", "start:dev"]
