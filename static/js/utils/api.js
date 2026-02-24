//接口
const api = {
  //权限接口
  //获取图形验证码
  getImgCode(data) {
    return request('get', '/auth/captcha', data, 'x-www-form-urlencoded')
  },
  //获取动态加密串(设置密码用)
  getEncryptKey() {
    return request('get', '/auth/encryptKey', {}, 'x-www-form-urlencoded')
  },
  //忘记密码
  pwdForget(data) {
    return request('post', `/auth/forgetPassword`, data)
  },
  //获取手机验证码
  getMsgCode(data) {
    return request('get', `/auth/getSmsCode`, data, 'x-www-form-urlencoded')
  },
  //获取手机验证码-测试本地获取配合getSmsCode接口
  getMsgCode2(data) {
    return request('get', `/openApi/getPhoneSmsCode`, data, 'x-www-form-urlencoded')
  },
  //账号密码登录
  login(data) {
    return request('post', '/auth/login', data)
  },
  //新用户注册
  register(data) {
    return request('post', '/auth/register', data)
  },

  //上传接口
  //上传图片-公共目录
  uploadPub(data) {
    return uploadFile(`/file/common`, data)
  },
  //上传图片-图片目录
  uploadImg(data) {
    return uploadFile(`/file/images`, data)
  },
  //上传图片-头像目录
  uploadPic(data) {
    return uploadFile(`/file/pic`, data)
  },

  //用户接口
  //每日签到/签到领取积分
  setDaySign(data) {
    return request('get', `/user/attendance`, data, 'x-www-form-urlencoded')
  },
  //积分兑换金币
  pointsRecharge(data) {
    return request('get', `/user/exchangePointsForCoins`, data, 'x-www-form-urlencoded')
  },
  //金币充值
  coinsRecharge(data) {
    return request('post', `/user/coinsRecharge`, data)
  },
  // 金币充值预创建订单
  coinsRechargeOrder(data) {
    return request('post', `/user/coinsRechargeOrder`, data)
  },
  // 对公转账信息展示
  companyTransferInfo(data) {
    return request('get', `/user/companyTransferInfo`, data, 'x-www-form-urlencoded')
  },
  // 查询充值订单状态
  queryRechargeStatus(data) {
    return request('get', `/user/queryRechargeStatus`, data, 'x-www-form-urlencoded')
  },
  //金币充值记录
  pageCoinsRecharge(data) {
    return request('get', `/user/pageCoinsRecharge`, data, 'x-www-form-urlencoded')
  },
  //金币消费记录
  pageConsumption(data) {
    return request('get', `/user/pageConsumption`, data, 'x-www-form-urlencoded')
  },
  //用户重置密码
  pwdEditor(data) {
    return request('post', `/user/restPassword`, data)
  },
  //获取用户信息
  getUserInfo() {
    return request('get', `/user/getInfo`, '', 'x-www-form-urlencoded')
  },
  //修改用户信息
  editUserInfo(data) {
    return request('post', `/user/update`, data)
  },
  //根据手机号获取用户信息(无token)
  getOtherInfo(data) {
    return request('get', `/getAccountByPhone`, data, 'x-www-form-urlencoded')
  },
  //主题发布列表(我发布的信息列表)
  getMypostList(data) {
    return request('get', `/user/pageTopic`, data, 'x-www-form-urlencoded')
  },

  //我的收藏列表
  collectList(data) {
    return request('get', `/collect/page`, data, 'x-www-form-urlencoded')
  },
  //信息新增收藏
  addCollect(data) {
    return request('post', `/collect/add`, data)
  },
  //信息取消收藏
  delCollect(data) {
    return request('post', `/collect/delete`, data)
  },

  //账号升级
  updateLevel(data) {
    return request('get', `../static/json/report.json`, data)
  },

  //帖子信息相关
  // 获取推荐信息
  getRecList(data) {
    return request('get', `/topic/listRecommend`, data, 'x-www-form-urlencoded')
  },
  // 最新发布的信息列表
  getNewList() {
    return request('get', `/topic/listLastTopic`, {}, 'x-www-form-urlencoded')
  },
  // 搜索信息列表/主题内容分页查询
  getCateList(data) {
    return request('get', `/topic/page`, data, 'x-www-form-urlencoded')
  },
  // 根据ID获取主题内容详情
  getPostInfo(data) {
    return request('get', `/topic/getTopicDetails`, data, 'x-www-form-urlencoded')
  },
  // 您可能感兴趣列表/同类型主题列表
  getSimilarList(data) {
    return request('get', `/topic/listSimilarTopic`, data, 'x-www-form-urlencoded')
  },
  //新增信息/主题
  addPost(data) {
    return request('post', `/topicManager/add`, data)
  },
  //修改信息/主题
  editPost(data) {
    return request('post', `/topicManager/update`, data)
  },
  //删除信息/主题
  delPost(data) {
    return request('post', `/topicManager/delete/${data.id}`, {}, 'x-www-form-urlencoded')
  },
  //刷新信息-时间更新
  refreshPost(data) {
    return request('get', `../static/json/report.json`, data)
  },

  // 信息操作
  //置顶信息/新增置顶
  topPost(data) {
    return request('post', `/topManager/add`, data)
  },
  // 删除置顶
  topDel(data) {
    return request('post', `/topManager/delete/${data.id}`, {}, 'x-www-form-urlencoded')
  },
  // 修改置顶
  topUpdate(data) {
    return request('post', `/topManager/update`, data)
  },
  // 置顶分页列表
  getTopList(data) {
    return request('get', `/topManager/page`, data, 'x-www-form-urlencoded')
  },
  //加粗信息
  boldPost(data) {
    return request('get', `../static/json/report.json`, data)
  },
  //标红信息
  redPost(data) {
    return request('get', `../static/json/report.json`, data)
  },
  //举报信息
  reportPost(data) {
    return request('get', `../static/json/report.json`, data)
  },
  // 取消微信充值
  cancelRecharge(data) {
    return request('post', `/user/cancelRecharge/${data.orderNo}`, data)
  }

}