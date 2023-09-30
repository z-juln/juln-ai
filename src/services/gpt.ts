import Router from "koa-router";
import { PassThrough } from 'stream';
import { gptAI, gptAIStream } from "@/applications/ai";

const router = new Router();

router.get("/", async (ctx) => {
  type ApiQuery = { prompt: string; temperature?: string; };
  const {
    prompt,
    temperature = '0.7',
  } = ctx.request.query as ApiQuery;

  const chatCompletion = await gptAI(prompt, { temperature: +temperature });

  ctx.body = chatCompletion.choices[0].message.content;
});

router.get("/sse", async (ctx) => {
  type ApiQuery = { prompt: string; temperature?: string; };
  const {
    prompt,
    temperature = '0.7',
  } = ctx.request.query as ApiQuery;

  const chatStream = await gptAIStream(prompt, { temperature: +temperature });

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
