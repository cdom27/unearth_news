# build react client
FROM node:20 AS client-build
WORKDIR /client
COPY ./client ./client
COPY ./shared ./shared
RUN cd client && npm install && npm run build

# build express api
FROM node:20 AS server-build
WORKDIR /app

# clean copy
COPY ./api/package*.json ./
COPY ./api/tsconfig.json ./

RUN npm install

# explicitly copy source
COPY ./api/src ./src
COPY ./shared ./shared

# force clean build
RUN rm -rf dist .build && npm run build

# create prod image
FROM node:18-alpine
WORKDIR /app

# copy compiled api and client
COPY --from=server-build /app /app
COPY --from=client-build /client/client/dist /app/client/dist

ENV NODE_ENV=production
ENV PORT=8080
