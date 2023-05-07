const { createHash } = require("crypto");
const { TOKEN } = require("../../config/config.default.js");

const validateWechageHost = async (ctx) => {
  const { signature, timestamp, nonce, echostr } = ctx.query;
  const stringArray = [timestamp, nonce, TOKEN];
  const resultArray = stringArray.sort();
  const resultString = resultArray.join("");
  const hashResult = createHash("sha1").update(resultString).digest("hex");
  let isWeChatHost = false;
  if (hashResult === signature) {
    isWeChatHost = true;
  }
  return { echostr, isWeChatHost };
};

module.exports = {
  validateWechageHost,
};
