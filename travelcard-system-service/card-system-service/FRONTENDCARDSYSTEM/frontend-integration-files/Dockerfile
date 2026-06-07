# ==========================================
# Stage 1: Build Environment
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install exact dependencies listed in package-lock.json
RUN npm ci --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the production optimized bundle (outputs to /app/dist)
RUN npm run build

# ==========================================
# Stage 2: Serve Production Environment
# ==========================================
FROM nginx:alpine

# Copy our custom Nginx configuration optimized for Vite SPA
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
