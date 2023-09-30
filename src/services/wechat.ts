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

// https://juejin.cn/post/7223688436430569509
// https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Passive_user_reply_message.html
router.post("/", async (ctx) => {
  log.info('===wechat', ctx.request.query, ctx.request.body);
  const { nonce } = ctx.request.query as { nonce: string; };
  const data = ctx.request.body as xml2js.convertableToString;
  const xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
  const jsonData = await xmlParser.parseStringPromise(data);
  const xml = await wx.decrypt(jsonData.xml.Encrypt, '', nonce);
  const msg = await xmlParser.parseStringPromise(xml.message);
  const userContent = msg.xml.content;
  log.info("-----userContent", userContent);

  ctx.body = `
    <xml>
      <ToUserName><![CDATA[oO-x10Xky1zv7bJeqLAN2OeawgqA]]></ToUserName>
      <FromUserName><![CDATA[A1850021148]]></FromUserName>
      <CreateTime>${dayjs().unix()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${'😂😂😂😂😂: ' + userContent}]]></Content>
    </xml>
  `;
});

export default router;
