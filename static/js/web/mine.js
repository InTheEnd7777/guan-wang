const watchPoints = (rule, value, callback) => {
  let points = Number(app.userInfo.points),
    points2 = Number(app.form.points)

  if (points2 > points) {
    callback(new Error(`您当前的积分数最多只有${points}`));
  } else if (points2 % 8 != 0) {
    callback(new Error(`积分只能输入8的倍数`));
  }
  // else if(!app.form.coins){
  //   callback(new Error(`输入的积分数无法兑换金币`));
  // }
  else {
    callback();
  }
};

let app = new Vue({
  el: '#app',
  data: {
    isSign: false,
    userInfo: {},
    isAlert0: false,
    isAlert1: false,
    isAlert2: false,
    isAlert3: false,
    form: {
      points: '',
      coins: 0
    },
    rules: {
      points: [{
          required: true,
          message: "请输入积分数",
          trigger: "blur"
        },
        {
          required: true,
          validator: watchPoints,
          trigger: ["blur"] //, "change"
        }
      ]
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!getToken()) {
        reLogin()
        return
      }
      this.setTitle()
      this.getUserInfo()
    },
    setTitle() {
      document.title = `个人中心-${webName.title}`
      setHead('我的首页')
    },
    //获取用户信息
    getUserInfo() {
      api.getUserInfo().then(res => {
        let data = res.data || {}
        const {
          headPic,
          realName,
          idCard
        } = data
        //替换左侧头像
        if (headPic) {
          $('#myavatar').attr('src', headPic)
        }
        data.status = idCard && realName
        this.userInfo = data
        //判断每日签到
        this.isSign = data.isAttendance ? true : false
        //用户信息缓存
        localStorage.userInfo = JSON.stringify(data)
      })
    },
    //身份证校验
    checkCard() {
      let {
        realName,
        idCard
      } = this.userInfo
      if (!(realName && idCard)) {
        layer.confirm('当前账号未实名认证，发布主题必须填写认证信息！', {
          title: "提示",
          btn: ['确定'],
          icon: false
        }, () => {
          layer.closeAll()
          location.href = `./mycertify.html`
        }, (index) => {});
      }else{
        window.open('./addpost.html')
      }
    },
    //积分签到弹窗
    showSign() {
      loading()
      api.setDaySign().then(res => {
        loadhide()
        this.isAlert0 = true
        this.isSign = true
        this.userInfo.points = Number(this.userInfo.points) + 2
      }).catch(err => {
        toast(err)
      })
    },
    //兑换金币弹窗
    showPoints() {
      //清除校验
      this.$refs.form?.clearValidate()
      this.form.points = ''
      this.form.coins = 0
      this.isAlert1 = true
    },
    //输入0和正整数
    setNumber(val) {
      val = val.replace(/[^0-9]/g, '')
      if (val === '') {
        val = ''
      } else {
        val = Number(val)
      }
      this.form.points = val + ''
      let coins = 0
      if (val === '') {
        coins = 0
      } else if (val >= 0) {
        coins = Math.floor(val / 8)
      } else {
        coins = 0
      }
      this.form.coins = coins
    },
    //兑换积分
    exchange() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let {
            coins,
            points,
          } = this.form
          if (!coins) {
            toast('输入的积分数无法兑换金币')
            return
          }
          let param = {
            // coins,
            points
          }
          loading()
          api.pointsRecharge(param).then(res => {
            toast(`兑换成功！您的账号已成功增加${coins}金币`)
            this.isAlert1 = false
            this.getUserInfo()
          }).catch(err => {
            toast(err)
          })
        }

      })
    },
    //积分规则弹窗
    showAlert2() {
      this.isAlert2 = true
    },
    //信用等级弹窗
    showAlert3() {
      this.isAlert3 = true
    },
  }
})