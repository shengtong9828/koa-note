const { getColorErr } = require("../constant/err.type.js");
const { getGrayscale } = require("../plugins/index.js");
const color = require("../config/color.json");

class ColorController {
  async getColor(ctx) {
    try {
      const color1 = color[Math.floor(Math.random() * color.length)];
      const color2 = color[Math.floor(Math.random() * color.length)];
      let result = null;
      if (getGrayscale(color1.RGB) === getGrayscale(color2.RGB)) {
        result = [color1, color2];
      } else {
        result = [color1];
      }
      ctx.body = {
        code: 0,
        message: "获取颜色成功！",
        result,
      };
    } catch (error) {
      console.log(error);
      ctx.app.emit("error", getColorErr, ctx);
    }
  }
}

module.exports = new ColorController();
