import Application from "koa";
import KoaLogger from "koa-logger";
import log from "@/log";

const loggerMiddleWare: Application.Middleware = async (ctx, next) => {
  const { query, rawBody, body } = ctx.request;

  const middlewareLogger = KoaLogger((originalLog, [_, method, url]) => {
    log.info(originalLog);
    if (query) {
      log.info(`      query: ${JSON.stringify(query, null, 2)}`);
    }
    if (rawBody) {
      log.info(`      rawBody: ${JSON.stringify(rawBody, null, 2)}`);
    }
    if (body) {
      log.info(`      body: ${JSON.stringify(body, null, 2)}`);
    }
  });

  await middlewareLogger(ctx, next);
};

export default loggerMiddleWare;
