//获取参数
function getParams(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

//封装公司名 1方舟 2半亩
let webType = 2

// 看看是不是缓存文件
let webName = {}
if (webType == 1) {
  webName = {
    type: 1,
    class: 'fangzhou',
    title: "方舟信息网",
    company: "浙江方舟文化有限公司",
    short: "浙江方舟文化",
    logo: "../static/img/base/logo2.png",
    logo2: "../static/img/base/logo.png",
    ico: "../static/img/base/favicon.ico",
    banner1: "../static/img/banner/banner1.jpg",
    banner2: "../static/img/banner/banner2.jpg",
    headImg: "../static/img/base/head1.jpg",
    loginImg: "../static/img/base/login.jpg",
    tel: "0571-87221997",
    mail: "hr@100ark.com",
    addr: "浙江省杭州市西湖区西园五路2号西圆紫行大厦1号楼1705室",
    icp: "浙ICP备19033264号-1",
    info: "方舟信息网，是国内专注于网页搭建、软件定制、UI设计、APP研发领域的专业信息对接平台，自创立以来，我们始终以 “链接优质技术资源，赋能企业数字化转型” 为核心使命，致力于为有技术开发需求的企业、创业者与专业技术服务商搭建高效、透明、靠谱的合作桥梁。",
    // 方舟信息网，为你提供网页搭建、软件定制、UI设计、APP研发等分类主题，充分满足您查看/发布信息的需求。
    // info: "浙江方舟文化有限公司成立于2018年06月25日，注册地位于浙江省杭州市西湖区三墩镇西园五路2号西圆紫行大厦1号楼1705室，法定代表人为李敏。经营范围包括广播电视节目制作；专题、专栏、综艺、动画片、广播剧、电视剧的制作、复制、发行（上述经营范围凭许可证经营）；影视策划；广告的设计、制作、代理、发布（凡涉及许可证的凭有效许可证经营）；文化创意策划；文化艺术交流活动策划；教育信息咨询（不含出国留学咨询与中介服务）；市场营销策划；承办会展；会务服务；灯光设备、音响设备、舞台设备的租赁；成年人的非证书劳动职业技能培训（涉及前置审批的项目除外）；电子商务技术、网络信息技术、电子产品的技术开发、技术服务、技术咨询、成果转让；计算机软硬件、教育软件、游戏软件、电子产品（除专控）的批发、零售；经营电信业务。（依法须经批准的项目，经相关部门批准后方可开展经营活动）"
  }
} else if (webType == 2) {
  webName = {
    type: 2,
    class: 'banmu',
    title: "杭州半亩方塘网络科技有限公司",
    company: "杭州半亩方塘网络科技有限公司",
    short: "杭州半亩方塘",
    logo: "../static/img2/base/logo2.png",
    logo2: "../static/img/base/logo.png",
    ico: "../static/img2/base/favicon.ico",
    banner1: "../static/img2/banner/banner1.jpg",
    banner2: "../static/img2/banner/banner2.jpg",
    headImg: "../static/img2/base/head1.jpg",
    loginImg: "../static/img2/base/login.jpg",
    tel: "0571-86952532",
    // mail: "hr@100ark.com",
    addr: "浙江省杭州市西湖区西湖街道乾龙路80号A1010",
    icp: "浙ICP备2022002507号",
    info: "杭州半亩方塘网络科技有限公司，是国内聚焦网页搭建、软件定制、UI 设计及 APP 研发领域的专业信息对接平台。自创立伊始，我们始终秉持 “链接优质技术资源，赋能企业数字化转型” 的核心使命，致力于为有技术开发需求的企业与创业者，搭建与专业技术服务商之间高效、透明、可靠的合作桥梁。",
    // info: "杭州半亩方塘网络科技有限公司，是一家全国移动互联网高新技术企业，公司长期深耕移动互联网数字营销行业与中国移动、中国联通、中国电信等通信行业头部企业建立了长期稳定的合作关系，并与巨量引擎、腾讯广点通、磁力引擎、百度等国内头部信息流媒体建立了深度合作关系。公司拥有强大的市场营销能力和资源整合能力，致力为运营商、商企、政务、教育、电商等多领域客户提供优质的数字营销解决方案。",
  }
}


setIco()
//设置小图标/主题类
function setIco() {
  let ico = `<link rel="shortcut icon" href="${webName.ico}" type="image/x-icon" />`
  $('head').append(ico)
  $('body').addClass(webName.class)
}

// 接口前缀 local本地 -dev开发 -test测试 空正式
let WebPre = ""
let WebUrl = "",
  WebUrl2 = ""
//数据来源
let WebSource = ""
//缺省图
const WebErrImg = "../static/img/base/noimg.png"
//开启短信本地获取
const WebTest = 0
//是否打印
const WebLog = 0

setWebInit()

function setWebInit() {
  if (WebPre == "local") {
    //本地
    WebUrl = "http://192.168.0.180:8081"
    WebUrl2 = ""
    WebSource = "hzbmft"
  } else if (WebPre == "-dev") {
    //开发
    WebUrl = "http://192.168.0.180:8081"
    WebUrl2 = ""
    WebSource = "hzbmft"
  } else if (WebPre == "-test") {
    //测试
    WebUrl = "http://192.168.0.180:8081"
    WebUrl2 = ""
    WebSource = "hzbmft"
  } else {
    //正式
    let url = location.href
    if (url.indexOf('http://www.bm-ft.cn') > -1) {

      WebUrl = "http://www.bm-ft.cn/api"
    } else {
      WebUrl = "http://bm-ft.cn/api"
      // WebUrl = ""
    }
    // WebSource = "hzbmft"

    WebUrl2 = ""
    // WebSource = "default" //自定义的  original
    WebSource = "hzbmft" //自定义的  original
  }
  if (!WebLog) {
    console.log = function () {
      return ''
    }
  }
}

//图片缺省
function imgErr(that) {
  that.src = WebErrImg
}

//接口请求
function ajax(obj) {
  let type = obj.type || "post",
    ctType = obj.ctType
  let contentType = ""
  if (type == "get") {
    contentType = `application/${ctType || "x-www-form-urlencoded"}`
  } else if (type == "post") {
    if (ctType == 'form-data') {
      contentType = `multipart/form-data`
    } else {
      contentType = `application/${ctType || "json"}`
    }
  }
  let url = `${WebUrl}${obj.url}`
  if (obj.url.indexOf('.json') > -1) {
    //本地json判断
    url = `${obj.url}`
  }
  if (obj.preType == 2) {
    //另一个接口前缀
    url = `${WebUrl2}${obj.url}`
  }
  if (obj.full == true) {
    url = obj.url
  }
  let headers = {
    'X-Source-From': WebSource
  }
  let token = getToken()
  // let token = '52e74c00a37a77c86076ae5e074cadad'
  
  if (token) {
    headers['x-access-token'] = token
  }
  $.ajax({
    type,
    url,
    data: obj.data,
    contentType,
    headers,
    success: (res) => {
      obj.success(res)
    },
    error: (err) => {
      console.log(err)
    }
  })
}

//二次封装
function request(type, url, data, ctType, preType, full) {
  return new Promise((resolve, reject) => {
    ajax({
      type: type,
      url: url,
      full: full || 0,
      ctType,
      preType,
      data: type == 'post' ? JSON.stringify(data) : data,
      success: res => {
        let {
          code,
          data,
          msg
        } = res
        //成功默认0
        if (code == 200 || code == 0) {
          resolve(res)
        } else {
          if (code == 401 || data.indexOf('重新登录') > -1) {
            localStorage.removeItem('token')
          }
          reject(data)
        }
      }
    })
  })
}

//上传封装
function uploadFile(url, form) {
  url = `${WebUrl}${url}`
  let headers = {
    'x-access-token': getToken(),
    'X-Source-From': WebSource
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      type: "post",
      cache: false,
      data: form,
      headers,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false
    }).done(res => {
      res = JSON.parse(res)
      let {
        code,
        data,
        msg
      } = res
      if (code == 200 || code == 0) {
        resolve(res)
      } else {
        if (code == 401 || data.indexOf('重新登录') > -1) {
          quitLogin(1)
        }
        reject(data)
      }
    }).fail(err => {
      console.log(err)
    })
  })
}

//获取缓存的用户信息
function getLocUserInfo() {
  if (getToken()) {
    let userInfo = JSON.parse(localStorage.userInfo || '{}')
    return userInfo
  } else {
    return {}
  }
}

//重新登录
function reLogin() {
  localStorage.removeItem('token')
  location.href = './login.html'
}

//退出登录
function quitLogin(type) {
  clearToken()
  if (type == 1) {
    location.href = './index.html'
  } else {
    location.reload();
  }
}

//退出登录
function getToken() {
  let token = localStorage.token || ''
  return token
}

//清除token
function clearToken() {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  //清除所有cookie
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name2 = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    const domAIn = window.location.hostname;
    document.cookie = name2 + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}

//layer弹窗
function toast(txt, opt) {
  loadhide()
  layer.msg(txt + '', opt || {})
}

function loading(time) {
  loadhide()
  layer.load(1, {
    time: time || 60000
  })
}

function loadhide() {
  layer.closeAll()
}

//ele弹窗
function message(that, txt, type) {
  loadhide()
  that.$message({
    message: txt,
    type: type || 'success'
  });
}

//去除对象空key值
function delEmptyKeys(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value === null || value === undefined || value === "") {
        delete obj[key];
      }
    }
  }
  return obj;
}

//获取日期,前后第几天、当前日期带时间
function getDay(num, istime) {
  const t = new Date()
  t.setDate(t.getDate() + num) //获取num天后的日期
  const y = t.getFullYear()
  const m = ('0' + (t.getMonth() + 1)).slice(-2),
    d = ('0' + t.getDate()).slice(-2),
    h = ('0' + t.getHours()).slice(-2),
    m2 = ('0' + t.getMinutes()).slice(-2),
    s = ('0' + t.getSeconds()).slice(-2)
  if (istime == 1) {
    return y + '-' + m + '-' + d + ' ' + h + ':' + m2 + ':' + s
  } else if (istime == 2) {
    return y + m + d
  } else {
    return y + '-' + m + '-' + d
  }
}

//base64加密
function base64Encode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

//base64解密
function base64Decode(str) {
  if (!str) {
    return
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}