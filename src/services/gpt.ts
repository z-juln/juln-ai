import Router from "koa-router";
import { PassThrough } from 'stream';
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import openai from "@/openai";

const router = new Router();

router.get("/", async (ctx) => {
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

router.get("/sse", async (ctx) => {
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

export default router;
