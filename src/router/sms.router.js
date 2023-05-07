const Router = require("koa-router");
const {
  createPicCode,
  createSmsCode,
} = require("../controller/sms.controller");
const { validator } = require("../middleware/auth.middleware");
const {
  validatorPicCode,
  validatorPhoneNumber,
  validatorSendTime,
} = require("../middleware/sms.middleware");

const router = new Router({ prefix: "/api/sms" });

// 获取图片验证码
router.post("/getPicCode", createPicCode);

// 通过图片验证码获取手机验证码
router.post(
  "/getSmsCodeByPicCode",
  validator({
    picCode: { type: "string", max: "4", min: "4" },
    phoneNumbers: {
      type: "string",
      format:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      message: "手机号格式错误",
    },
  }),
  validatorPicCode,
  validatorSendTime,
  createSmsCode
);

// 校验数据库后获取手机验证码
router.post(
  "/getSmsCode",
  validator({
    phoneNumbers: {
      type: "string",
      format:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      message: "手机号格式错误",
    },
  }),
  validatorPhoneNumber,
  validatorSendTime,
  createSmsCode
);

module.exports = router;
