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

  const xmlBody = await getXmlBody();
  log.info('===xmlBody', xmlBody);

  const xml = await wx.decrypt(xmlBody.xml.Encrypt, timestamp, nonce);
  const msg = await xmlParser.parseStringPromise(xml.message);
  const userContent = msg.xml.content;
  log.info("-----userContent", userContent);

  ctx.body = `
    <xml>
      <ToUserName><![CDATA[${openid}]]></ToUserName>
      <FromUserName><![CDATA[A1850021148]]></FromUserName>
      <CreateTime>${dayjs().unix()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${'😂😂😂😂😂: ' + userContent}]]></Content>
    </xml>
  `;
});

export default router;
