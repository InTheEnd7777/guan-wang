//顶部导航
function setHead(name) {
  let userInfo = getLocUserInfo()
  let html =
    `<div class="toolbar">
  <div class="clearfix toolbar-inner">
    <div class="quicklink">
      <ul id="mymps_website_links" class="accesslink">
        <a href="./index.html" target="_blank">返回${webName.title}首页</a>
      </ul>
    </div>
    <div class="userbar">
      <a class="username" href="./mine.html">${userInfo?.phone||''}</a>
      <!-- <a href="" style="margin-top:1px">短消息</a> -->
      <span style="margin-top:1px" onclick="logOut()">退出</span>
    </div>
  </div>
</div>
<div class="header">
  <div class="clearfix header-inner">
    <div class="brand">
      <h1>
      <a href="./index.html" target="_blank">
        <img src="${webName.logo}" max-height="100">
      </a>
      </h1>
      <!-- <h2><a href="./mine.html">个人中心</a></h2> -->
    </div>
  </div>
</div>
<div class="clearfix siteportalnav">
  <ul>
    <li>
      <a href="./index.html" target="_blank">
        <span>
          <strong>首页</strong>
        </span>
      </a>
    </li>
    <li class="usercenter">
      <a class="current" href="./mine.html">
        <span>
          <strong>个人中心</strong>
        </span>
      </a>
    </li>
  </ul>
</div>
<div class="subnav">
  <div class="clearfix subnav-inner">
    <div class="crumbnav">
      <a href="./mine.html"><span>个人中心</span></a> <span class="separator">»</span> ${name}
    </div>
  </div>
</div>`
  $('#toolbar').html(html)
  setLtMenu(name)
}

//底部信息
setFooter()

function setFooter() {
  let html =
    `<div class="footer">
  <div class="clearfix footer-inner">
    <p class="copyright">
      CopyRight © <a href="./index.html">${webName.company}</a> 商务联系:${webName.tel} </p>
    <p class="extrainfo">
      All Rights Reserved. 
      <a rel="nofollow" href="http://www.miibeian.gov.cn/" style="color:red">${webName.icp}</a>
    </p>
  </div>
</div>`
  $('#footer').html(html)
}

//左侧菜单
function setLtMenu(name) {
  let userInfo = JSON.parse(localStorage?.userInfo || '{}')
  let html =
    `<div class="sidebar">
  <div class="sidebar-inner">
    <div class="sidebarmenu">
      <div class="sidebarmenu-inner">
        <div class="sidebarmenu-list">
          <ul class="faceview">
            <div class="img">
              <img src="${userInfo.headPic||'../static/template/images/noavatar_small.gif'}" width="66" height="66" id="myavatar">
            </div>
          </ul>
          <ul>
            <li id="sdmenu1" data-val="我的首页">
              <a href="./mine.html" class="house">我的首页</a>
            </li>
            <li id="sdmenu2" data-val="分类主题">
              <a class="info" href="./mypost.html">分类主题</a>
            </li>
            <li id="sdmenu3" data-val="金币充值">
              <a class="pay" href="./mycoins.html">金币充值</a>
            </li>
            <li id="sdmenu4" data-val="更换头像">
              <a class="avatar" href="./myavatar.html">更换头像</a>
            </li>
            <li id="sdmenu5" data-val="收藏列表">
              <a class="shoucang" href="./mycollect.html">收藏列表</a>
            </li>
            <li id="sdmenu6" data-val="个人信息">
              <a class="base" href="./myinfo.html">个人信息</a>
            </li>
            <li id="sdmenu7" data-val="身份认证">
              <a class="certify" href="./mycertify.html">身份认证</a>
            </li>
            <!-- <li id="sdmenu8" data-val="短消息">
              <a class="pm" href="./mymsg.html">短消息</a>
            </li> -->
            <!-- <li id="sdmenu9" data-val="账号升级">
              <a class="levelup" href="./mylevel.html">账号升级</a>
            </li> -->
            <li id="sdmenu10" data-val="更换密码">
              <a class="password" href="./mypwd.html">更换密码</a>
            </li>
          </ul>
        </div>
        <!-- <div style="margin-top:6px">
          <a href="" title="我是商户，申请开通商家管理平台">
            <img src="../static/template/images/shop_apply.gif">
          </a>
        </div> -->
      </div>
    </div>
  </div>
</div>`
  $('#sidebar').html(html)
  //菜单选中
  $(`li[data-val=${name}]`).addClass('current')
}

//退出登录
function logOut() {
  layer.confirm('确定要退出登录吗？', {
    title: "提示",
    btn: ['确定', '取消']
  }, () => {
    console.log('确定')
    layer.closeAll()
    //返回首页
    quitLogin(1)
  }, (index) => {});
}