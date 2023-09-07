# ARG <name>[=<default value>]
# E.G.
# ARG SETTINGS
# RUN ./run/init-stuff $SETTINGS

ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine AS build
RUN apk update && apk add python make g++ && rm -rf /var/cache/apk/*
WORKDIR /app
COPY package*.json ./
RUN npm i --only=production
COPY . .


# FROM gcr.io/distroless/nodejs:debug
FROM gcr.io/distroless/nodejs:${NODE_VERSION} AS production
WORKDIR /app
COPY --from=build /app .

ARG ARG_API_PORT=3000
ARG ARG_NODE_ENV=production
ARG ARG_VAULT=
EXPOSE $ARG_API_PORT
EXPOSE 3001
ENV API_PORT $ARG_API_PORT
ENV NODE_ENV $ARG_NODE_ENV
ENV VAULT $ARG_VAULT
ENV PORT $ARG_API_PORT
CMD ["index.js"]

FROM build AS development
WORKDIR /app

ARG ARG_API_PORT=3000
ARG ARG_NODE_ENV=development
ARG ARG_VAULT=
ENV NODE_ENV=$ARG_NODE_ENV
ENV API_PORT $ARG_API_PORT
ENV VAULT $ARG_VAULT
ENV PORT $ARG_API_PORT
EXPOSE $ARG_API_PORT
RUN npm install --only=development
COPY --from=build /app .
CMD ["node", "index.js"]

FROM development AS test
ARG ARG_API_PORT=3000
ARG ARG_NODE_ENV=development
ARG ARG_VAULT=
ENV NODE_ENV=$ARG_NODE_ENV
ENV API_PORT $ARG_API_PORT
ENV VAULT $ARG_VAULT
ENV PORT $ARG_API_PORT
CMD ["npm", "test"]
