import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import log from '@/log';
import simpleAiRouter from '@/services/simple-ai';
import gptRouter from '@/services/gpt';
import wechatRouter from '@/services/wechat';
import loggerMiddleWare from '@/help/logger-middleware';

const app = new Koa();
const router = new Router();
app.use(bodyParser());
app.use(loggerMiddleWare);
app.use(router.routes());

router.use('simple-ai', simpleAiRouter.routes());
router.get("/gpt", gptRouter.routes());
router.get("/wechat", wechatRouter.routes());

app.listen(80, () => {
  log.info("Server is running, http://localhost/gpt?prompt=鲁迅认识周树人吗?");
});
