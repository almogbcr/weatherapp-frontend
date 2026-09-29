# syn
# BUILD
# get Node.js image for frontend build
FROM node:20-alpine AS build

#metadata
LABEL maintainer="almog"
LABEL description="React frontend for weather app"
LABEL version="1.0.0"
LABEL env="production"

#Set the working directory
WORKDIR /opt/weatherapp/frontend
#Copy the requirements file to the working directory
COPY package*.json ./
#Install the dependencies
RUN npm ci
#Copy the rest of the application code to the working directory
COPY . .

ARG VITE_MAPTILER_API_KEY
ENV VITE_MAPTILER_API_KEY=$VITE_MAPTILER_API_KEY
#Build the React application
RUN npm run build

# Serve the application with NGINX 
FROM nginx:alpine
COPY --from=build /opt/weatherapp/frontend/dist /usr/share/nginx/html  
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
