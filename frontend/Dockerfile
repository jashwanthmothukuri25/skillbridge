FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL=https://graceful-laughter-production-b701.up.railway.app/api
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server.js ./server.js
COPY package.json ./package.json
EXPOSE 3000
CMD ["node", "server.js"]
