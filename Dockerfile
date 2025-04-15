# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install serve to run the application
RUN npm install -g serve

# Expose port 3000 (Easypanel default)
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"] 