import Application from "koa";
import KoaLogger from "koa-logger";
import log from "@/log";

const loggerMiddleWare: Application.Middleware = async (ctx, next) => {
  const { query, rawBody, body, xmlBody } = ctx.request;

  const middlewareLogger = KoaLogger((originalLog, [_, method, url]) => {
    log.info(originalLog);
    if (query) {
      log.info(`      query: ${query}`);
    }
    if (rawBody) {
      log.info(`      rawBody: ${rawBody}`);
    }
    if (body) {
      log.info(`      body: ${body}`);
    }
    if (xmlBody) {
      log.info(`      xmlBody: ${xmlBody}`);
    }
  });

  await middlewareLogger(ctx, next);
};

export default loggerMiddleWare;
