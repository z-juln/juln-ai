FROM node:18
ADD . /app
WORKDIR /app
RUN   pwd && yarn config set registry https://registry.npmmirror.com/ && \
      yarn install && \
      yarn start
EXPOSE 80
