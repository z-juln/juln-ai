import { OpenAI } from 'openai';
import Koa from 'koa';
import logger from 'koa-logger';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { PassThrough } from 'stream';
import axios from 'axios';
import log from './log';

const app = new Koa();
const router = new Router();
app.use(logger((originalLog, [_, method, url]) => {
  log.info(originalLog.replace(url, decodeURIComponent(url)));
}));
app.use(bodyParser());
app.use(router.routes());

const openai = new OpenAI({
  apiKey: "sk-TG4ZoUUcJYb5RSIWk0xzP66SHdPoJlyAMpmq5pa5o9G0ev4A",
  baseURL: 'https://api.chatanywhere.com.cn/v1',
});

router.get('/simple-ai', async (ctx) => {
  const { prompt } = ctx.request.query;
  ctx.redirect(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${prompt}`);
});

router.get("/gpt", async (ctx) => {
  type ApiBody = Pick<ChatCompletionCreateParamsBase, 'temperature'> & { prompt: string; };
  const {
    temperature = 0.7, // 控制生成文本的创造性，值越高则越随机
    prompt,
  } = ctx.request.query as unknown as ApiBody;

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature,
    messages: [{ role: 'user', content: prompt }],
  }, {
    timeout: 5 * 1000,
  });

  ctx.body = chatCompletion.choices[0].message.content;
});

router.get("/gpt/sse", async (ctx) => {
  type ApiBody = Pick<ChatCompletionCreateParamsBase, 'temperature'> & { prompt: string; };
  const {
    temperature = 0.7, // 控制生成文本的创造性，值越高则越随机
    prompt,
  } = ctx.request.query as unknown as ApiBody;

  const chatStream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  }, {
    timeout: 5 * 1000,
  });

  ctx.request.socket.setTimeout(0);
  ctx.req.socket.setNoDelay(true);
  ctx.req.socket.setKeepAlive(true);
  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  ctx.status = 200;
  const stream = new PassThrough();
  ctx.body = stream;

  for await (const part of chatStream) {
    stream.write(part.choices[0]?.delta?.content || '');
  }
});

app.listen(80, () =>
  log.info("Server is running, http://localhost/gpt?prompt=鲁迅认识周树人吗?")
);
