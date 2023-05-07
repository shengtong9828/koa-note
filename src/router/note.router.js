const Router = require("koa-router");
const xss = require("xss");
const {
  addNote,
  delNote,
  modifyNote,
  getNotes,
} = require("../controller/note.controller");
const { getColor } = require("../controller/color.controller");
const { validator } = require("../middleware/auth.middleware");

const router = new Router({ prefix: "/api/note" });
// xss(content)
router.post("/getColor", getColor);

router.post("/getNotes", getNotes);

// 创建
router.post(
  "/addNote",
  validator({
    content: {
      type: "string",
      max: 10000,
      min: 1,
      message: "请输入正确的内容！",
    },
  }),
  addNote
);

// 修改
router.post(
  "/modifyNote",
  validator({
    id: {
      type: "number",
      message: "唯一标识不能为空！",
    },
    content: {
      type: "string",
      max: 10000,
      min: 1,
      message: "请输入正确的内容！",
    },
  }),
  modifyNote
);

// 删除
router.post(
  "/delNote",
  validator({
    id: {
      type: "number",
      message: "唯一标识不能为空！",
    },
  }),
  delNote
);

module.exports = router;
