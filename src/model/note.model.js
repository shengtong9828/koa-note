const { DataTypes } = require("sequelize");

const seq = require("../db");

const Note = seq.define("note", {
  // id 会被sequelize自动创建，管理
  content: {
    type: DataTypes.STRING(10000),
    allowNull: false,
    comment: "内容",
  },
});

// 强制同步数据库（创建数据表）
// Note.sync({ force: true });

module.exports = Note;
