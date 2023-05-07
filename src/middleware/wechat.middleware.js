const { createHash } = require("crypto");
const { TOKEN } = require("../config/config.default.js");
const { notWeChatHost } = require("../constant/err.type");

const isWeChatHost = async (ctx, next) => {
  const { signature, timestamp, nonce } = ctx.query;
  const stringArray = [timestamp, nonce, TOKEN];
  const resultString = stringArray.sort().join("");
  const hashResult = createHash("sha1").update(resultString).digest("hex");
  if (hashResult !== signature) {
    return ctx.app.emit("error", notWeChatHost, ctx);
  }
  await next();
};

module.exports = {
  isWeChatHost,
};
