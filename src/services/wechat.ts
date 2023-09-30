import Router from "koa-router";
import { WxCrypto } from 'node-wxcrypto';
import xml2js from "xml2js";
import dayjs from "dayjs";
import log from "@/log";
import { wechat as wechatConfig } from "@/config";
import { AIType, getAIAnswer, gptAI, simpleAI } from "@/applications/ai";

const wx = new WxCrypto(
  wechatConfig.token,
  wechatConfig.EncodingAESKey,
  wechatConfig.appid,
);

const router = new Router();

router.get("/", (ctx) => {
  const { echostr } = ctx.request.query as { echostr: string; };
  if (echostr) {
    ctx.body = echostr;
  }
});

const xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });

// https://juejin.cn/post/7223688436430569509
// https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Passive_user_reply_message.html
router.post("/", async (ctx) => {
  type ApiQuery = { timestamp: string; nonce: string; openid: string; };
  const { timestamp, nonce, openid } = ctx.request.query as ApiQuery;

  const getXmlBody = () => new Promise<any>((resolve, reject) => {
    let buf = '';
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', (chunk) => {
      buf += chunk;
    });
    ctx.req.on('end', () => {
      xmlParser.parseStringPromise(buf)
        .then(resolve)
        .catch(reject);
    });
  });

  type WechatXML = {
    xml: {
      ToUserName: string;
      FromUserName: string;
      CreateTime: string;
      MsgType: string;
      Content: string;
      MsgId: string;
    };
  };

  const xmlBody = await getXmlBody() as WechatXML;
  const { Content: userContent } = xmlBody.xml;
  log.info('      xmlBody', xmlBody);

  ctx.response.type = 'application/xml';

  const getResXmlbody = (answer: string) => `
    <xml>
      <ToUserName><![CDATA[${xmlBody.xml.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${xmlBody.xml.ToUserName}]]></FromUserName>
      <CreateTime>${dayjs().unix()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${answer}]]></Content>
    </xml>
  `;

  const getAITypeAndPrompt = (userContent: string): { aiType: AIType | null; userPrompt: string | null; } => {
    const invalidRes = { aiType: null, userPrompt: null };
    const matchArgs = userContent.match(/^\[(.*?)\]:(.+)$/)?.[1] ?? null;
    if (matchArgs) {
      const [_, aiType, userPrompt] = matchArgs;
      if (!['simple-ai', 'gpt'].includes(aiType)) return invalidRes;
      return { aiType: aiType as AIType, userPrompt };
    }
    return invalidRes;
  };

  const { aiType, userPrompt } = getAITypeAndPrompt(userContent);

  if (aiType === null || userPrompt === null) {
    ctx.body = getResXmlbody(`
      ai用法指南:
        - 输入 [simple-ai]: 鲁迅认识周树人吗?
        - 输入 [gpt]: 鲁迅认识周树人吗?
    `);
    return;
  }

  const aiAnswer = await getAIAnswer({ aiType, prompt: userPrompt });
  log.info('      aiAnswer', aiAnswer);

  ctx.body = getResXmlbody(aiAnswer ?? `ai暂无响应`);
});

export default router;
