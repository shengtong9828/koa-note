const Router = require("koa-router");

const router = new Router({ prefix: "/api/tenant" });

router.get("/", (ctx) => {
  ctx.body = "tenant";
});

module.exports = router;
