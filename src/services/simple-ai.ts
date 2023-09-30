import Router from "koa-router";

const router = new Router();

router.get("/", (ctx) => {
  const { prompt } = ctx.request.query;
  ctx.redirect(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${prompt}`);
});

export default router;
