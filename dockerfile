FROM node:18
ADD . /app
VOLUME ["/app/logs", "/logs"]
WORKDIR /app
EXPOSE 3000
CMD pwd && \
    yarn install && \
    yarn start
