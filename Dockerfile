# Stage 1: Build React app
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

ARG MODE=production
ENV NODE_ENV=$MODE
RUN yarn build --mode $MODE

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
