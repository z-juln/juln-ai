import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import log from '@/log';
import simpleAiRouter from '@/services/simple-ai';
import gptRouter from '@/services/gpt';
import wechatRouter from '@/services/wechat';
import loggerMiddleWare from '@/help/logger-middleware';

declare module "koa" {
  interface Request {
    xmlBody: any;
  }
}

const app = new Koa();
app.use(bodyParser());
app.use(loggerMiddleWare);
const router = new Router();
app.use(router.routes());

router.get('/healthy', (ctx) => ctx.body = 'healthy');
router.use('/simple-ai', simpleAiRouter.routes());
router.use('/gpt', gptRouter.routes());
router.use('/wechat', wechatRouter.routes());

app.listen(80, () => {
  log.info('Server is running, http://localhost/gpt?prompt=鲁迅认识周树人吗?');
});
