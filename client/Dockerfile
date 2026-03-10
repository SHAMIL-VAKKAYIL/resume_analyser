# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app


# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Declare build argument and expose as env var for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
# Vite builds to the "dist" directory by default.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
