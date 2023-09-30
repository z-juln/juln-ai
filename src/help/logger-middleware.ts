import Application from "koa";
import KoaLogger from "koa-logger";
import log from "@/log";

const loggerMiddleWare: Application.Middleware = async (ctx, next) => {
  const { rawBody, query, xmlBody } = ctx.request;

  const middlewareLogger = KoaLogger((originalLog, [_, method, url]) => {
    log.info(url);
    if (query) {
      log.info(`      query: ${query}`);
    }
    if (rawBody) {
      log.info(`      body: ${rawBody}`);
    }
    if (xmlBody) {
      log.info(`      xmlBody: ${xmlBody}`);
    }
  });

  await middlewareLogger(ctx, next);
};

export default loggerMiddleWare;
