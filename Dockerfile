# syntax = docker/dockerfile:1

ARG NODE_VERSION=18.20.5
FROM node:${NODE_VERSION}-slim AS base

# 1) Set up working dirs, system deps
WORKDIR /app
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# 2) BUILD THE CLIENT (devDependencies needed)
WORKDIR /app/client

ENV NODE_ENV=development

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# 3) NOW SET NODE_ENV=production FOR THE SERVER
ENV NODE_ENV=production
ENV PORT=8080

# 4) SET UP THE SERVER
WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci

COPY server/ ./

# 5) Move the client build into public
RUN mkdir -p public && cp -r /app/client/dist/* public/

EXPOSE 8080
CMD [ "npm", "run", "start" ]