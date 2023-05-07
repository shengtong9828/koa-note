const { DataTypes } = require("sequelize");

const seq = require("../db");

// 创建模型（Model t_user -> ）
const User = seq.define("users", {
  // id 会被sequelize自动创建，管理
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: "用户名，唯一",
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: true,
    comment: "密码",
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "昵称",
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "头像",
  },
  phone: {
    type: DataTypes.CHAR(11),
    allowNull: false,
    unique: true,
    comment: "手机号",
  },
  role_code: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: "角色代码（0：普通用户（默认），44：管理员）",
  },
});

// 强制同步数据库（创建数据表）
// User.sync({ force: true });

module.exports = User;
