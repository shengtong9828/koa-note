const {
  picCodeError,
  phoneNumberNotExistsError,
  sendFrequentlyError,
} = require("../constant/err.type");
const { checkPhoneNumber } = require("../service/user.service");

const validatorPicCode = async (ctx, next) => {
  const { picCode } = ctx.request.body;
  const { picCodes } = ctx.session;
  if (picCodes && picCodes.filter((item) => item === picCode).length > 0) {
    ctx.session.picCodes = ctx.session.picCodes.filter(
      (item) => item !== picCode
    );
    await next();
  } else {
    return ctx.app.emit("error", picCodeError, ctx);
  }
};

const validatorPhoneNumber = async (ctx, next) => {
  const { phoneNumbers } = ctx.request.body;
  const result = await checkPhoneNumber(phoneNumbers);
  if (result) {
    await next();
  } else {
    return ctx.app.emit("error", phoneNumberNotExistsError, ctx);
  }
};

const validatorSendTime = async (ctx, next) => {
  const { phoneNumbers } = ctx.request.body;
  if (
    ctx.session &&
    ctx.session.smsCodes &&
    ctx.session.smsCodes[phoneNumbers]
  ) {
    const { time } = ctx.session.smsCodes[phoneNumbers];
    if (time) {
      const currentTime = new Date();
      const lastSendTime = new Date(time);
      if (currentTime - lastSendTime < 60 * 1000) {
        return ctx.app.emit("error", sendFrequentlyError, ctx);
      }
    }
  }
  await next();
};

module.exports = {
  validatorPicCode,
  validatorPhoneNumber,
  validatorSendTime,
};
