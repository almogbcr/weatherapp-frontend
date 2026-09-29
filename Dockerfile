FROM node:20-alpine AS build

LABEL maintainer="almog"
LABEL description="React frontend for weather app"
LABEL version="1.0.0"
LABEL env="production"

WORKDIR /opt/weatherapp/frontend

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_MAPTILER_API_KEY
ENV VITE_MAPTILER_API_KEY=$VITE_MAPTILER_API_KEY

RUN npm run build


FROM nginx:alpine

COPY --from=build /opt/weatherapp/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]