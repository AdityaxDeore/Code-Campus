# ─── Backend API Server ───
FROM node:20-alpine

WORKDIR /app/server

# Copy server package files and install deps
COPY server/package*.json ./
RUN npm install --production

# Copy server source code
COPY server/ ./

# .env not needed in Docker — env vars set via docker-compose

EXPOSE 5001

CMD ["node", "index.js"]
