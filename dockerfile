FROM node:18
ADD . /app
VOLUME ["/app/logs", "/logs"]
WORKDIR /app
RUN   pwd && \
      yarn install && \
      yarn start
EXPOSE 80
