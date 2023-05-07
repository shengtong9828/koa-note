const User = require("../model/user.model.js");

class UserService {
  async createUser(user_name, password) {
    // 插入数据
    // await表达式：promise对象的值
    const res = await User.create({
      user_name,
      password,
    });
    return res.dataValues;
  }

  async createAndGetInfo(phone) {
    const isExists = await User.findOne({
      where: { phone },
    });
    if (!isExists) {
      const temp = "t_" + Date.now();
      await User.create({
        username: temp,
        nickname: temp,
        phone,
      });
    }
    const res = await User.findOne({
      attributes: ["id", "username", "nickname", "phone", "role_code"],
      where: { phone },
    });

    return res ? res.dataValues : null;
  }

  async checkPhoneNumber(phone) {
    return await User.findOne({
      where: { phone },
    });
  }
}

module.exports = new UserService();
