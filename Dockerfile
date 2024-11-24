FROM busybox:1.35 as base

RUN adduser -D static
USER static
WORKDIR /home/static

FROM node:22.11 as build

# ENV NODE_ENV production
WORKDIR /src

COPY . .

RUN npm install
#build client
RUN npm run build

# Create a non-root user to own the files and run our server

FROM base AS final
WORKDIR /home/static
COPY --from=build /src/dist .

# Run BusyBox httpd
CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]
