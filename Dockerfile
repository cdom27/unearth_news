# Build react client
FROM node:20 AS client-build
WORKDIR /workspace

COPY ./shared ./shared
COPY ./client ./client

RUN cd client && npm install && npm run build

# Build express api
FROM node:20 AS server-build
WORKDIR /workspace

COPY ./shared ./shared
COPY ./api ./api

RUN cd api && npm install && npm run build

# Debug - check the FULL nested structure
RUN echo "=== DIST structure ===" && find /workspace/api/dist -name "*.js" | head -20

# Create prod image
FROM node:20-alpine
WORKDIR /workspace/api

COPY --from=server-build /workspace/api/dist ./dist
COPY --from=server-build /workspace/api/node_modules ./node_modules
COPY --from=server-build /workspace/api/package*.json ./

COPY --from=server-build /workspace/api/src/config ./src/config
COPY --from=server-build /workspace/shared ../shared
COPY --from=client-build /workspace/client/dist ../client/dist

# Debug final image
RUN echo "=== Final image structure ===" && find . -name "index.js" | head -10

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["node", "dist/api/src/index.js"]
