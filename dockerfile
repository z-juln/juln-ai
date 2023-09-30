FROM node:18
ADD . /app
VOLUME ["/app/logs", "/logs"]
WORKDIR /app
RUN pwd && \
    yarn install
EXPOSE 3000
CMD yarn start
