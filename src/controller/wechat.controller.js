const xml2js = require("xml2js");
const { getTextTemplate } = require("../plugins/index.js");
const {
  findTenant,
  updateTenant,
  findTenantByPk,
} = require("../service/tenant.service.js");
const { parseTime } = require("../plugins/index.js");
const {
  subscribe,
  ztMsg,
  zwzyMsg,
  rentInfo,
  rentFinalInfo,
  statusDict,
  tenantInfo,
} = require("../config/wechatMsg.js");
const { MANAGE_OPENID } = require("../config/config.default.js");

class ColorController {
  async passVerfiry(ctx) {
    ctx.body = ctx.query.echostr;
  }
  // okVqiwR3neluEnnd7MvqrsoyjgkQ
  async replay(ctx, next) {
    let xmlObj = await xml2js.parseStringPromise(ctx.request.body);
    let xmlJson = {};
    for (let item in xmlObj.xml) {
      xmlJson[item] = xmlObj.xml[item][0];
    }
    console.log("xmlJson", xmlJson);
    try {
      let { tenant } = await findTenant(xmlJson.FromUserName);
      console.log("tenant---", tenant);

      // #region 接收到关注申请
      if (xmlJson.Event === "subscribe") {
        ctx.body = getTextTemplate(xmlJson, subscribe(tenant.id));
      }
      // #endregion

      // #region 接受到用户的消息
      else if (MANAGE_OPENID !== xmlJson.FromUserName) {
        // 1.接受到消息1，即用户申请租用
        if (xmlJson.Content === "1") {
          if (tenant.status === "0") {
            // 修改租用状态，申请租用时间，清空退租时间，申请退租时间
            try {
              const res = await updateTenant(
                tenant.id,
                "1",
                null,
                new Date(),
                null,
                null
              );
              ctx.body = getTextTemplate(xmlJson, ztMsg(res));
            } catch (error) {
              console.log("error ---- ", error);
              ctx.body = getTextTemplate(xmlJson, "申请失败！");
            }
          } else if (["1", "3"].includes(tenant.status)) {
            ctx.body = getTextTemplate(xmlJson, ztMsg(tenant));
          } else if (tenant.status === "2") {
            ctx.body = getTextTemplate(xmlJson, rentInfo(tenant));
          } else if (tenant.status === "4") {
            try {
              const res = await updateTenant(tenant.id, "0");
              ctx.body = getTextTemplate(
                xmlJson,
                `${rentFinalInfo(tenant)}
再次回复1，申请租用！`
              );
            } catch (error) {
              ctx.body = getTextTemplate(xmlJson, "申请失败！");
            }
          }
        }
        // 2.接受到消息2，即用户查询租用信息
        else if (xmlJson.Content === "2") {
          if (tenant.status === "0") {
            ctx.body = getTextTemplate(xmlJson, zwzyMsg(tenant.id));
          } else if (["1", "3"].includes(tenant.status)) {
            ctx.body = getTextTemplate(xmlJson, ztMsg(tenant));
          } else if (tenant.status === "2") {
            ctx.body = getTextTemplate(xmlJson, rentInfo(tenant));
          } else if (tenant.status === "4") {
            ctx.body = getTextTemplate(xmlJson, rentFinalInfo(tenant));
          }
        }
        // 3.接受到消息3，即用户申请退租
        else if (xmlJson.Content === "3") {
          if (tenant.status === "0") {
            ctx.body = getTextTemplate(xmlJson, zwzyMsg(tenant.id));
          } else if (["1", "3"].includes(tenant.status)) {
            ctx.body = getTextTemplate(xmlJson, ztMsg(tenant));
          } else if (tenant.status === "2") {
            try {
              const res = await updateTenant(
                tenant.id,
                "3",
                tenant.rentAt,
                tenant.applyRentAt,
                null,
                new Date()
              );
              ctx.body = getTextTemplate(xmlJson, ztMsg(res));
            } catch (error) {
              console.log("error ---- ", error);
              ctx.body = getTextTemplate(xmlJson, "申请失败！");
            }
          } else if (tenant.status === "4") {
            ctx.body = getTextTemplate(xmlJson, rentFinalInfo(tenant));
          }
        } else {
          ctx.body = "";
        }
        if (!ctx.body) {
          console.log("null=====");
          ctx.body = "";
        }
      }
      // #endregion
      // #region 接受到管理员消息
      else if (MANAGE_OPENID === xmlJson.FromUserName) {
        // 租用
        if (xmlJson.Content.indexOf("z:") !== -1) {
          const id = xmlJson.Content.substr(2);
          let { tenant } = await findTenantByPk(id);
          if (!tenant) {
            ctx.body = getTextTemplate(
              xmlJson,
              `暂无用户${id.toString().padStart(4, "0")}！`
            );
          } else if (tenant.status === "0") {
            ctx.body = getTextTemplate(
              xmlJson,
              `用户${id.toString().padStart(4, "0")}暂无租用申请！`
            );
          } else if (tenant.status === "1") {
            // 通过申请
            try {
              const res = await updateTenant(
                tenant.id,
                "2",
                new Date(),
                tenant.applyRentAt,
                null,
                null
              );
              ctx.body = getTextTemplate(xmlJson, tenantInfo(res));
            } catch (error) {
              console.log("error ---- ", error);
              ctx.body = getTextTemplate(xmlJson, "通过申请失败！");
            }
          } else {
            ctx.body = getTextTemplate(xmlJson, tenantInfo(tenant));
          }
        }
        // 退租
        else if (xmlJson.Content.indexOf("t:") !== -1) {
          const id = xmlJson.Content.substr(2);
          let { tenant } = await findTenantByPk(id);
          if (!tenant) {
            ctx.body = getTextTemplate(
              xmlJson,
              `暂无用户${id.toString().padStart(4, "0")}！`
            );
          } else if (tenant.status === "3") {
            try {
              const res = await updateTenant(
                tenant.id,
                "4",
                tenant.rentAt,
                tenant.applyRentAt,
                new Date(),
                tenant.applyReturnAt
              );
              ctx.body = getTextTemplate(xmlJson, tenantInfo(res));
            } catch (error) {
              console.log("error ---- ", error);
              ctx.body = getTextTemplate(xmlJson, `通过申请失败！`);
            }
          } else {
            ctx.body = getTextTemplate(xmlJson, tenantInfo(tenant));
          }
        } else if (xmlJson.Content.indexOf("c:") !== -1) {
          const id = xmlJson.Content.substr(2);
          let { tenant } = await findTenantByPk(id);
          if (!tenant) {
            ctx.body = getTextTemplate(
              xmlJson,
              `暂无用户${id.toString().padStart(4, "0")}！`
            );
          } else {
            ctx.body = getTextTemplate(xmlJson, tenantInfo(tenant));
          }
        } else {
          ctx.body = "";
        }
        if (!ctx.body) {
          console.log("null222=====");
          ctx.body = "";
        }
      }
      // #endregion
    } catch (error) {
      console.log("error ---- ", error);
      ctx.body = getTextTemplate(xmlJson, "获取用户信息失败！");
    }
  }
}

module.exports = new ColorController();
