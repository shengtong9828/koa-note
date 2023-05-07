const jwt = require("jsonwebtoken");

const { userLoginError } = require("../constant/err.type.js");
const { createAndGetInfo } = require("../service/user.service.js");
const { JWT_SECRET } = require("../config/config.default.js");

class UserController {
  async login(ctx) {
    const { phoneNumbers } = ctx.request.body;
    try {
      const { password, ...res } = await createAndGetInfo(phoneNumbers);
      ctx.body = {
        code: 0,
        message: "用户登录成功",
        result: {
          userInfo: res,
          token: jwt.sign(res, JWT_SECRET, { expiresIn: "1d" }),
        },
      };
    } catch (error) {
      console.error("用户登录失败", error);
      ctx.app.emit("error", userLoginError, ctx);
    }
  }
}

module.exports = new UserController();
