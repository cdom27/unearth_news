# build react client
FROM node:20 AS client-build
WORKDIR /client
COPY ./client ./client
COPY ./shared ./shared
RUN cd client && npm install && npm run build

# build express api
FROM node:20 AS server-build
WORKDIR /app

# Copy API package files and tsconfig
COPY ./api/package*.json ./
COPY ./api/tsconfig.json ./

# Install dependencies
RUN npm install

COPY ./shared ./shared
RUN mkdir -p node_modules/@shared
RUN ln -s /app/shared node_modules/@shared

# copy API source files
COPY ./api/src ./src

RUN npm run build

# create prod image
FROM node:18-alpine
WORKDIR /app

# copy compiled api and client
COPY --from=server-build /app /app
COPY --from=client-build /client/client/dist /app/client/dist

ENV NODE_ENV=production
ENV PORT=8080
