const Router = require("koa-router");
const { isWeChatHost } = require("../middleware/wechat.middleware");
const { passVerfiry, replay } = require("../controller/wechat.controller");

const router = new Router({ prefix: "/api/wechat" });

router.post("/", isWeChatHost, replay);

router.get("/", isWeChatHost, passVerfiry);

module.exports = router;
