import Application from "koa";
import KoaLogger from "koa-logger";
import log from "@/log";

const loggerMiddleWare: Application.Middleware = async (ctx, next) => {
  const middlewareLogger = KoaLogger((originalLog, [_, method, url]) => {
    log.info(originalLog.replace(url, decodeURIComponent(url)));
  });

  const noopNext = async () => {};

  const { method, rawBody } = ctx.request;
  if (method === 'POST') {
    middlewareLogger(ctx, noopNext);
    log.info(`      body: ${rawBody}`);
    return await next();
  }
};

export default loggerMiddleWare;
