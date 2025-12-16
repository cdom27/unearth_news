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

# Debug: check what got built
RUN echo "=== API contents ===" && ls -la /workspace/api
RUN echo "=== DIST contents ===" && ls -la /workspace/api/dist || echo "DIST NOT FOUND!"

# Create prod image
FROM node:18-alpine
WORKDIR /workspace/api

# Copy built API
COPY --from=server-build /workspace/api/dist ./dist
COPY --from=server-build /workspace/api/node_modules ./node_modules
COPY --from=server-build /workspace/api/package*.json ./

# Copy shared folder to the parent directory
COPY --from=server-build /workspace/shared ../shared

# Copy built client
COPY --from=client-build /workspace/client/dist ../client/dist

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["node", "dist/index.js"]
