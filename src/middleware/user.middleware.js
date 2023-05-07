const bcrypt = require("bcryptjs");

const { userFormateError, smsCodeError } = require("../constant/err.type.js");

const userValidator = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  // 合法性
  if (!username || !password) {
    console.error("用户名或密码为空", ctx.request.body);
    ctx.app.emit("error", userFormateError, ctx);
    return;
  }
  await next();
};

const cryptPasswod = async (ctx, next) => {
  const { password } = ctx.request.body;

  const salt = bcrypt.genSaltSync(10);
  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt);

  ctx.request.body.password = hash;

  await next();
};

const verifySmsLogin = async (ctx, next) => {
  const { smsCode, phoneNumbers } = ctx.request.body;
  const { smsCodes } = ctx.session;
  if (
    smsCodes &&
    smsCodes[phoneNumbers] &&
    smsCodes[phoneNumbers].code === smsCode
  ) {
    delete ctx.session.smsCodes[phoneNumbers];
    await next();
  } else {
    return ctx.app.emit("error", smsCodeError, ctx);
  }
};

module.exports = {
  userValidator,
  cryptPasswod,
  verifySmsLogin,
};
