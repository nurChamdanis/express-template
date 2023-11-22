# ARG <name>[=<default value>]
# E.G.
# ARG SETTINGS
# RUN ./run/init-stuff $SETTINGS

# Set Node Version
ARG NODE_VERSION=20

# base build
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app/apps
COPY apps/package.json ./
RUN npm i --only=production
WORKDIR /app
COPY package.json ./
RUN npm i --only=production
COPY . .

# FROM gcr.io/distroless/nodejs:debug
FROM gcr.io/distroless/nodejs:${NODE_VERSION} AS production
WORKDIR /app
COPY --from=build /app .

ARG ARG_API_PORT=3000
ARG ARG_NODE_ENV=production
EXPOSE $ARG_API_PORT
EXPOSE 3001
ENV API_PORT $ARG_API_PORT
ENV NODE_ENV $ARG_NODE_ENV
ENV PORT $ARG_API_PORT
CMD ["index.js"]

FROM build AS development
WORKDIR /app

ARG ARG_API_PORT=3000
ARG ARG_NODE_ENV=development
ENV NODE_ENV=$ARG_NODE_ENV
ENV API_PORT $ARG_API_PORT
ENV PORT $ARG_API_PORT
EXPOSE $ARG_API_PORT
RUN npm install
COPY --from=build /app .
CMD ["node", "index.js"]

FROM development AS test
ARG ARG_API_PORT=3000
ARG ARG_NODE_ENV=development
ENV NODE_ENV=$ARG_NODE_ENV
ENV API_PORT $ARG_API_PORT
ENV PORT $ARG_API_PORT
CMD ["npm", "test"]
