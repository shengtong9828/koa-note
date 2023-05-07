/**
 * 短信随机数
 * @returns  {string}
 */
const randomSmsCode = () => {
  const pasArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let password = "";
  for (var i = 0; i < 6; i++) {
    let x = Math.floor(Math.random() * pasArr.length);
    password += pasArr[x];
  }
  return password;
};

/**
 * 格式化时间
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns  {string | null}
 */
const parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
};

/**
 * 获取两个数组的重复元素个数
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {number}
 */
const getDupCount = (arr1, arr2) => {
  if (
    (typeof arr1 === "string" && typeof arr1 === "string") ||
    (Object.prototype.toString.call(arr1) == "[object Array]" &&
      Object.prototype.toString.call(arr2) == "[object Array]")
  ) {
    let dupArr = Array.from(new Set(arr1.concat(arr2)));
    return arr1.length + arr2.length - dupArr.length;
  } else {
    return -1;
  }
};

/**
 * 获取获奖等级
 * @param {string} dupCount
 * @param {boolen} mark
 * @returns
 */
const getRanking = (dupCount, mark) => {
  if (
    (mark && [0, 1, 2].includes(dupCount)) ||
    (!mark && [3].includes(dupCount))
  ) {
    return 6;
  } else if (
    (mark && [3].includes(dupCount)) ||
    (!mark && [4].includes(dupCount))
  ) {
    return 5;
  } else if (
    (mark && [4].includes(dupCount)) ||
    (!mark && [5].includes(dupCount))
  ) {
    return 4;
  } else if (mark && [5].includes(dupCount)) {
    return 3;
  } else if (!mark && [6].includes(dupCount)) {
    return 2;
  } else if (mark && [6].includes(dupCount)) {
    return 1;
  } else {
    return -1;
  }
};

/**
 * 三区比
 * @param {Array} arr
 * @returns string
 */
const getThreeRate = (arr) => {
  const zone1 = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
  ];
  const zone2 = [
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
  ];
  const zone3 = [
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
  ];
  return `${getDupCount(zone1, arr)}:${getDupCount(zone2, arr)}:${getDupCount(
    zone3,
    arr
  )}`;
};

/**
 * @description 按配置的{元素:概率}在指定样本大小下按概率随机获得某个元素
 * @param probability 每个元素被选中概率的集合
 * @topBound 样本大小
 */
const chanceSelect = (probability, topBound) => {
  if (probability == null || probability.length == 0) return null;

  var sum = 0; //sum就是总次数
  for (var k in probability) {
    sum += probability[k] * topBound;
  }
  // 从1开始
  var rand = parseInt(Math.random() * sum) + 1;

  for (var k in probability) {
    //对应的概率次数值，该值越大则rand<=0的机会越大
    rand -= probability[k] * topBound;
    // 选中
    if (rand <= 0) {
      var item = k;
      return item;
    }
  }
  return null;
};

/**
 * 获取颜色灰度
 * @param { r, g, b} rgb rgb值
 * @returns
 */
const getGrayscale = ({ 0: r, 1: g, 2: b }) => {
  return 0.213 * r + 0.715 * g + 0.072 * b > 255 / 2;
};

const getTextTemplate = (xmlJson, reMes) => {
  return `<xml>
      <ToUserName><![CDATA[${xmlJson.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${xmlJson.ToUserName}]]></FromUserName>
      <CreateTime>${new Date()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${reMes}]]></Content>
    </xml>`;
};

module.exports = {
  randomSmsCode,
  parseTime,
  getDupCount,
  getRanking,
  getThreeRate,
  chanceSelect,
  getGrayscale,
  getTextTemplate,
};
