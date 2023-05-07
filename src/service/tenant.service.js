const Tenant = require("../model/tenant.model.js");

class TenantService {
  async findTenant(openid) {
    const [tenant, created] = await Tenant.findOrCreate({
      where: { openid },
      defaults: {
        openid,
        status: "0",
      },
    });
    return { tenant: tenant.dataValues, created };
  }
  async findTenantByPk(id) {
    const tenant = await Tenant.findByPk(id);
    return { tenant: tenant && tenant.dataValues };
  }
  async updateTenant(id, status, rentAt, applyRentAt, returnAt, applyReturnAt) {
    // 插入数据
    // await表达式：promise对象的值
    const res = await Tenant.findByPk(id);
    if (res) {
      res.status = status;
      res.rentAt = rentAt;
      res.applyRentAt = applyRentAt;
      res.returnAt = returnAt;
      res.applyReturnAt = applyReturnAt;
      await res.save();
    }
    return res.dataValues;
  }
}

module.exports = new TenantService();
