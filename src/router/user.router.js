const Router = require("koa-router");
const { login } = require("../controller/user.controller");
const { verifySmsLogin } = require("../middleware/user.middleware");
const { validator } = require("../middleware/auth.middleware");

const router = new Router({ prefix: "/api/user" });

// 手机短信登录接口
router.post(
  "/login",
  validator({
    smsCode: {
      type: "string",
      format: /\d{6}/,
      message: "验证码格式错误",
    },
    phoneNumbers: {
      type: "string",
      format:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      message: "手机号格式错误",
    },
  }),
  verifySmsLogin,
  login
);

// 手机短信注册并登录接口
router.post(
  "/registerAndLogin",
  validator({
    smsCode: {
      type: "string",
      format: /\d{6}/,
      message: "验证码格式错误",
    },
    phoneNumbers: {
      type: "string",
      format:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      message: "手机号格式错误",
    },
  }),
  verifySmsLogin,
  login
);

module.exports = router;
