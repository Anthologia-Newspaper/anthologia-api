###
# Builder image
###
FROM node:lts AS builder

WORKDIR /app

# Install dependecies
COPY package.json .
COPY package-lock.json .

RUN npm install --omit=dev

# Copy source (see .dockerignore)
COPY . .

RUN npx prisma generate

# Build source
RUN npm run build

###
# Production image
###
FROM node:lts as app

WORKDIR /app

# Copy package manager
COPY --from=builder /app/package.json .

# Copy dependencies
COPY --from=builder /app/node_modules node_modules

# Copy code
COPY --from=builder /app/dist dist
COPY --from=builder /app/prisma prisma

EXPOSE 5555
EXPOSE 8080

# Prefix commands
ENTRYPOINT ["npm", "run"]

# Start production (migrate database, generate prisma client and run app)
CMD ["start:prod"]