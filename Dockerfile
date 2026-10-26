
FROM node:24-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source code and build the application
COPY . .
RUN npm run build

# Serve the built frontend using Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Add custom Nginx configuration for backend API routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
