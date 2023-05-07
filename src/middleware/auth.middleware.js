const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/config.default.js");
const {
  tokenExpiredError,
  jsonWebTokenError,
  hasNotAdminPermission,
  formatError,
} = require("../constant/err.type");

const auth = async (ctx, next) => {
  const { authorization = "" } = ctx.request.header;
  const token = authorization.replace("Bearer ", "");

  try {
    // user中包含了payload的信息（id, user_name, is_admin）
    const user = jwt.verify(token, JWT_SECRET);
    ctx.state.user = user;
  } catch (error) {
    console.error(error);
    switch (error.name) {
      case "TokenExpiredError":
        console.error("token已过期", error);
        return ctx.app.emit("error", tokenExpiredError, ctx);
      case "JsonWebTokenError":
        console.error("无效的token", error);
        return ctx.app.emit("error", jsonWebTokenError, ctx);
      default:
        break;
    }
  }
  await next();
};

const hadAdminPermission = async (ctx, next) => {
  const { role_code } = ctx.state.user;

  if (role_code !== 44) {
    return ctx.app.emit("error", hasNotAdminPermission, ctx);
  }
  await next();
};

const validator = (rules) => {
  return async (ctx, next) => {
    try {
      console.log("rules", rules);
      ctx.verifyParams(rules);
    } catch (error) {
      console.error(error);
      formatError.result = error;
      return ctx.app.emit("error", formatError, ctx);
    }
    await next();
  };
};

module.exports = {
  auth,
  hadAdminPermission,
  validator,
};
