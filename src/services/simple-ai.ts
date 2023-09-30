import Router from "koa-router";
import { simpleAI } from "@/applications/ai";

const router = new Router();

router.get("/", async (ctx) => {
  type ApiQuery = { prompt: string; };
  const { prompt } = ctx.request.query as ApiQuery;
  ctx.body = await simpleAI(prompt);
});

export default router;
