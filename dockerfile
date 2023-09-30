FROM swr.cn-north-4.myhuaweicloud.com/opsci/node:v16.19.0-1
ADD . /app
VOLUME ["/app/logs", "/logs"]
WORKDIR /app
RUN   pwd && \
      yarn install && \
      yarn start
EXPOSE 80
