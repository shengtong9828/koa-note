const {
  getNotesErr,
  addNoteErr,
  modifyNoteErr,
  delNoteErr,
  noFindId,
} = require("../constant/err.type.js");
const {
  createNote,
  findNotes,
  findFirstNote,
  findNotesCount,
  updateNote,
  deleteNote,
} = require("../service/note.service.js");

class NoteController {
  async getNotes(ctx) {
    // 1. 解析请求参数
    const { pageNum = 1, pageSize = 10, content } = ctx.request.body;
    try {
      // 2. 操作数据库
      const res = await findNotes(pageNum, pageSize, content);
      // 3. 返回结果
      ctx.body = {
        code: 0,
        message: "获取笔记列表成功！",
        result: res,
      };
    } catch (error) {
      ctx.app.emit("error", getNotesErr, ctx);
    }
  }

  async addNote(ctx) {
    try {
      const count = await findNotesCount();
      let res = null;
      const { content } = ctx.request.body;
      if (count >= 1000) {
        const firstNote = await findFirstNote();
        res = await updateNote(firstNote.id, content);
      } else {
        res = await createNote(content);
      }
      ctx.body = {
        code: 0,
        message: "添加笔记成功！",
        result: null,
      };
    } catch (error) {
      ctx.app.emit("error", addNoteErr, ctx);
    }
  }

  async modifyNote(ctx) {
    try {
      const { id, content } = ctx.request.body;
      const res = await updateNote(id, content);
      if (res) {
        ctx.body = {
          code: 0,
          message: "修改笔记成功！",
          result: null,
        };
      } else {
        ctx.app.emit("error", noFindId, ctx);
      }
    } catch (error) {
      ctx.app.emit("error", modifyNoteErr, ctx);
    }
  }

  async delNote(ctx) {
    try {
      const { id } = ctx.request.body;
      const res = await deleteNote(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "删除笔记成功！",
          result: null,
        };
      } else {
        ctx.app.emit("error", noFindId, ctx);
      }
    } catch (error) {
      ctx.app.emit("error", delNoteErr, ctx);
    }
  }
}

module.exports = new NoteController();
