const Note = require("../model/note.model.js");
const xss = require("xss");
const { Op } = require("sequelize");

class NoteService {
  async findNotes(pageNum, pageSize, content) {
    const offset = (pageNum - 1) * pageSize;
    const where = content ? { content: { [Op.like]: `%${content}%` } } : {};
    console.log(where);
    const { count, rows } = await Note.findAndCountAll({
      where,
      offset: offset,
      limit: +pageSize,
      order: [["updatedAt", "DESC"]],
    });
    return {
      pageNum,
      pageSize,
      total: count,
      list: rows,
    };
  }

  async findFirstNote() {
    const res = await Note.findOne({ order: [["updatedAt", "ASC"]] });
    return res ? res.dataValues : null;
  }

  async findNotesCount() {
    return await Note.count();
  }

  async createNote(content) {
    const res = await Note.create({ content: xss(content) });
    return res.dataValues;
  }

  async updateNote(id, content) {
    const res = await Note.findByPk(id);
    if (res) {
      res.content = content;
      await res.save();
    }
    return res ? res.dataValues : null;
  }

  async deleteNote(id) {
    const res = await Note.findByPk(id);
    if (res) {
      await res.destroy();
    }
    return res ? res.dataValues : null;
  }
}

module.exports = new NoteService();
