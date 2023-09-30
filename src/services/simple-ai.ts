import Application from "koa";

const simpleAi: Application.Middleware = (ctx) => {
  const { prompt } = ctx.request.query;
  ctx.redirect(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${prompt}`);
};

export default simpleAi;
