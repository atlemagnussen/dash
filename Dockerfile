FROM node:22.11 as build

ENV NODE_ENV production

WORKDIR /app

COPY . .

#build client
RUN npm run build

FROM busybox:1.35 as prod

# Create a non-root user to own the files and run our server
RUN adduser -D static
USER static
WORKDIR /home/static

COPY --from=build /app/dist .

# Run BusyBox httpd
CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]