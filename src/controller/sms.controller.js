const svgCaptcha = require("svg-captcha");
const Core = require("@alicloud/pop-core");
const {
  accessKeyId,
  accessKeySecret,
  endpoint,
  apiVersion,
  SignName,
  TemplateCode,
} = require("../config/config.default.js");
const { randomSmsCode } = require("../plugins/index.js");

class SmsController {
  async createPicCode(ctx) {
    const cap = svgCaptcha.create({
      size: 4, // 验证码长度
      width: 160,
      height: 60,
      fontSize: 50,
      ignoreChars: "0oO1ilI", // 验证码字符中排除 0o1i
      noise: 2, // 干扰线条的数量
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: "#eee", // 验证码图片背景颜色
    });

    let img = cap.data; // 验证码
    let text = cap.text.toLowerCase(); // 验证码字符，忽略大小写
    if (!ctx.session.picCodes) {
      ctx.session.picCodes = [];
    }
    ctx.session.picCodes.push(text);
    // 设置响应头
    ctx.response.type = "image/svg+xml";
    ctx.body = img;
  }

  async createSmsCode(ctx) {
    const client = new Core({
      accessKeyId,
      accessKeySecret,
      endpoint,
      apiVersion,
    });
    const { phoneNumbers } = ctx.request.body;
    const code = randomSmsCode();
    const time = new Date().toJSON();
    const TemplateParam = JSON.stringify({ code });
    const params = {
      SignName,
      TemplateCode,
      PhoneNumbers: phoneNumbers,
      TemplateParam,
    };
    const requestOption = {
      method: "POST",
    };
    await client.request("SendSms", params, requestOption).then(
      (result) => {
        if (!ctx.session.smsCodes) {
          ctx.session.smsCodes = {};
        }
        ctx.session.smsCodes[phoneNumbers] = { code, time };
        ctx.body = {
          code: 0,
          message: "短信发送成功",
          result: "",
        };
      },
      (ex) => {
        ctx.body = {
          code: 1,
          message: "短信发送失败",
          result: "",
        };
        console.error(ex);
      }
    );
  }
}

module.exports = new SmsController();
