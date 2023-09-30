import Application from "koa";
import KoaLogger from "koa-logger";
import log from "@/log";

const loggerMiddleWare: Application.Middleware = async (ctx, next) => {
  const { rawBody } = ctx.request;

  const middlewareLogger = KoaLogger((originalLog, [_, method, url]) => {
    log.info(originalLog.replace(url, decodeURIComponent(url)));
    if (method === 'POST') {
      log.info(`      body: ${rawBody}`);
    }
  });

  await middlewareLogger(ctx, next);
};

export default loggerMiddleWare;
