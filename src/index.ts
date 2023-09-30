import Koa from 'koa';
import logger from 'koa-logger';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import log from '@/log';
import simpleAi from '@/services/simple-ai';
import { gpt, gptSSE } from '@/services/gpt';
import wechat from '@/services/wechat';

const app = new Koa();
const router = new Router();
app.use(logger((originalLog, [_, method, url]) => {
  log.info(originalLog.replace(url, decodeURIComponent(url)));
}));
app.use(bodyParser());
app.use(router.routes());

router.get('/simple-ai', simpleAi);
router.get("/gpt", gpt);
router.get("/gpt/sse", gptSSE);
router.get("/wechat", wechat);

app.listen(80, () =>
  log.info("Server is running, http://localhost/gpt?prompt=鲁迅认识周树人吗?")
);
