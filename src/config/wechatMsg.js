const { parseTime } = require("../plugins/index.js");

function head(id) {
  return `编号${id.toString().padStart(4, "0")}的用户您好！`;
}
function subscribe(id) {
  const msg = `${head(id)}
欢迎光临Qing淺的小摊！
回复1，申请租用。
回复2，查询租用信息。
回复3，申请退租。`;
  console.log("subscribe ---- ", msg);
  return msg;
}

function ztMsg(tenant) {
  const duration =
    tenant.status === "3"
      ? Math.floor(
          (new Date(tenant.applyReturnAt) - new Date(tenant.rentAt)) / 1000 / 60
        )
      : null;
  const msg = `${head(tenant.id)}
当前正在申请${tenant.status === "1" ? "租用" : "退租"}中！
申请租用：${parseTime(tenant.applyRentAt)}
${
  tenant.status === "3"
    ? `开始租用：${parseTime(tenant.rentAt)}
申请退租：${parseTime(tenant.applyReturnAt)}
租用时长：${duration}分钟
预计租金：${Math.ceil((duration - 10) / 60) * 2}元`
    : ""
}`;
  console.log("ztMsg ---- ", msg);
  return msg;
}

function zwzyMsg(id) {
  const msg = `${head(id)}
当前用户暂无租用信息！`;
  console.log("zwzyMsg ---- ", msg);
  return msg;
}

function rentInfo(tenant) {
  const currentTime = new Date();
  const duration = Math.floor(
    (new Date(currentTime) - new Date(tenant.rentAt)) / 1000 / 60
  );
  const msg = `${head(tenant.id)}
当前正在租用中！
申请租用：${parseTime(tenant.applyRentAt)}
开始租用：${parseTime(tenant.rentAt)}
当前时间：${parseTime(currentTime)}
租用时长：${duration}分钟
预计租金：${Math.ceil((duration - 10) / 60) * 2}元
`;
  console.log("rentInfo ---- ", msg);
  return msg;
}

function rentFinalInfo(tenant) {
  const duration = Math.floor(
    (new Date(tenant.returnAt) - new Date(tenant.rentAt)) / 1000 / 60
  );
  const msg = `${head(tenant.id)}
当前暂无租用信息！

以下是上次租用信息，
申请租用：${parseTime(tenant.applyRentAt)}
开始租用：${parseTime(tenant.rentAt)}
申请退租：${parseTime(tenant.applyReturnAt)}
结束租用：${parseTime(tenant.returnAt)}
租用时长：${duration}分钟
预计租金：${Math.ceil((duration - 10) / 60) * 2}元
`;
  console.log("rentFinalInfo ---- ", msg);
  return msg;
}

function tenantInfo(tenant) {
  const currentTime = new Date();
  const duration =
    tenant.returnAt && tenant.rentAt
      ? Math.floor(
          (new Date(tenant.returnAt) - new Date(tenant.rentAt)) / 1000 / 60
        )
      : tenant.rentAt
      ? Math.floor(
          (new Date(currentTime) - new Date(tenant.rentAt)) / 1000 / 60
        )
      : null;
  const msg = `编号：${tenant.id.toString().padStart(4, "0")}
openid：${tenant.openid}
状态：${statusDict[Number(tenant.status)]}
申请租用：${tenant.applyRentAt && parseTime(tenant.applyRentAt)}
开始租用：${tenant.rentAt && parseTime(tenant.rentAt)}
申请退租：${tenant.applyReturnAt && parseTime(tenant.applyReturnAt)}
退租时间：${tenant.returnAt && parseTime(tenant.returnAt)}
当前时间：${parseTime(currentTime)}
租用时长：${duration}分钟
预计租金：${duration && Math.ceil((duration - 10) / 60) * 2}元
创建时间：${parseTime(tenant.createdAt)}
修改时间：${parseTime(tenant.updatedAt)}
  `;
  console.log("tenantInfo ---- ", msg);
  return msg;
}

const statusDict = {
  0: "暂无租用",
  1: "申请租用中",
  2: "租用中",
  3: "申请退租中",
  4: "完成退租",
};

module.exports = {
  subscribe,
  zwzyMsg,
  ztMsg,
  rentInfo,
  rentFinalInfo,
  statusDict,
  tenantInfo,
};
