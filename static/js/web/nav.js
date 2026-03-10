//底部导航
setMenuBom()
function setMenuBom(){
  let html=
`<div class="container-fluid bg-light pt-5 px-sm-3 px-md-5">
  <div class="row">
    <div class="col-lg-2 col-md-6 mb-5"></div>
    <div class="col-lg-3 col-md-6 mb-5">
      <a href="./index.html" class="navbar-brand d-none d-lg-block">
        <img src="${webName.logo}" style="width: 300px;">
      </a>
      <p>联系电话：${webName.tel}<br>联系地址：${webName.addr}</p>
    </div>
    <div class="col-lg-2 col-md-6 mb-5">
    <h4 class="font-weight-bold mb-4">主题管理</h4>
    <div class="d-flex flex-wrap m-n1">
      <a href="./addpost.html" class="btn btn-sm btn-outline-secondary m-1">发布主题</a>
      <a href="./mypost.html" class="btn btn-sm btn-outline-secondary m-1">编辑主题</a>
      <a href="./search.html" class="btn btn-sm btn-outline-secondary m-1">主题搜索</a>
    </div>
  </div>

    <div class="col-lg-2 col-md-6 mb-5">
      <h4 class="font-weight-bold mb-4">相关导航</h4>
      <div class="d-flex flex-wrap m-n1">
        <a href="./aboutus.html?id=4" class="btn btn-sm btn-outline-secondary m-1">关于我们</a>
        <a href="./aboutus.html?id=9" class="btn btn-sm btn-outline-secondary m-1">联系我们</a>
        <a href="./aboutus.html?id=5" class="btn btn-sm btn-outline-secondary m-1">主题投诉</a>
      </div>
    </div>
    <div class="col-lg-2 col-md-6 mb-5"></div>

  </div>
</div>
<div class="container-fluid py-4 px-sm-3 px-md-5">
  <p class="m-0 text-center">Copyright © 2025 ${webName.company}版权所有 <a href="https://beian.miit.gov.cn"
  style="color:#1c8cf5"
      target="_blank">${webName.icp}</a></p>
</div>`
$('#menu-botom').html(html)
}