const path = require("path");

const Koa = require("koa");
const KoaBody = require("koa-body");
const KoaStatic = require("koa-static");
const parameter = require("koa-parameter");
const session = require("koa-session");

const errHandler = require("./errHandler.js");
const { JWT_SECRET } = require("../config/config.default.js");

const router = require("../router");

const app = new Koa();

app.keys = [JWT_SECRET];
const config = {
  key: "koa:sess",
  maxAge: 60 * 1000 * 5,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true, //每次访问将会重置过期时间
  renew: true,
};
app.use(session(config, app));
app.use(
  KoaBody({
    multipart: true,
    formidable: {
      // 在配置选项option里，不推荐使用相对路径
      // 在option里的相对路径，不是相对的当前文件，而是相对proces.cwd()
      uploadDir: path.join(__dirname, "../upload"),
      keepExtensions: true,
    },
    json: true,
    parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(KoaStatic(path.join(__dirname, "../upload")));
app.use(parameter(app));

app.use(router.routes()).use(router.allowedMethods());

// 统一错误处理
app.on("error", errHandler);

module.exports = app;
