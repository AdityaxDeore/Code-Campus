# ─── Frontend (Vite dev / build) ───
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# ─── Development Stage ───
FROM base AS dev
EXPOSE 4028
CMD ["npm", "start"]

# ─── Build Stage ───
FROM base AS build
RUN npm run build

# ─── Production Stage (serve with nginx) ───
FROM nginx:alpine AS production
COPY --from=build /app/build /usr/share/nginx/html

# Custom nginx config to handle SPA routing + API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
