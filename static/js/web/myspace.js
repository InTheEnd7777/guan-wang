let user = base64Decode(getParams('user'))||''

let app = new Vue({
  el: '#app',
  data: {
    webName,
    userInfo: {},
    otherInfo: {
      headPic: '',
      phone: '',
      regTime: '',
      status: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.setTitle()
      this.getUserInfo()
      this.getOtherInfo()
    },
    setTitle() {
      document.title = `${user}的个人空间-${webName.title}`
    },
    //获取用户信息
    getUserInfo() {
      if (!getToken()) {
        return
      }
      api.getUserInfo().then(res => {
        this.userInfo = res.data || {}
      })
    },
    //获取他人信息
    getOtherInfo() {
      if(!user){
        return
      }
      let param = {
        phone: user
      }
      api.getOtherInfo(param).then(res => {
        const {
          headPic,
          phone,
          registryTime,
          realName,
          idCard
        } = res.data || {}
        this.otherInfo = {
          headPic,
          phone,
          regTime: registryTime,
          status: idCard && realName
        }
      })
    },
    logOut() {
      layer.confirm('确定要退出登录吗？', {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        console.log('确定')
        layer.closeAll()
        quitLogin()
      }, (index) => {});
    }
  }
})