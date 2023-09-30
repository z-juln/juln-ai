import Router from "koa-router";
import { WxCrypto } from 'node-wxcrypto';
import xml2js from "xml2js";
import dayjs from "dayjs";
import log from "@/log";
import { wechat as wechatConfig } from "@/config";

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
    ToUserName: string;
    FromUserName: string;
    CreateTime: string;
    MsgType: string;
    Content: string;
    MsgId: string;
  };

  const xmlBody = await getXmlBody() as WechatXML;
  log.info('===xmlBody', xmlBody);

  ctx.body = `
    <xml>
      <ToUserName><![CDATA[${xmlBody.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${xmlBody.ToUserName}]]></FromUserName>
      <CreateTime>${dayjs().unix()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${'😂😂😂😂😂: ' + xmlBody.Content}]]></Content>
    </xml>
  `;
});

export default router;
