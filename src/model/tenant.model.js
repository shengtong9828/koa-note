const { DataTypes } = require("sequelize");

const seq = require("../db");

// 创建模型（Model t_user -> ）
const User = seq.define("tenant", {
  // id 会被sequelize自动创建，管理
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "昵称",
  },
  openid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: "微信openid",
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "0",
    comment:
      "状态，0：未租用，1：申请租用中，2：租用中，3：申请退租中，4：完成退租",
  },
  rentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "租用时间",
  },
  applyRentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "申请租用时间",
  },
  returnAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "退租时间",
  },
  applyReturnAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "申请退租时间",
  },
});

// 强制同步数据库（创建数据表）
// User.sync({ force: true });

module.exports = User;
