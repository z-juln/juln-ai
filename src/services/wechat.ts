import Application from "koa";

const wechat: Application.Middleware = async (ctx) => {
  const { echostr } = ctx.request.query as { echostr: string; };
  ctx.body = echostr;
};

export default wechat;
