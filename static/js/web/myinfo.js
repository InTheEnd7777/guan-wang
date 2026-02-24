//邮箱校验
const watchMail = (rule, value, callback) => {
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let val = app.form.email
  if (val && !reg.test(val)) {
    callback(new Error("邮箱格式不正确"));
  } else {
    callback();
  }
}

// 检测中文
const isChn = (rule, value, callback) => {
  var reg = new RegExp("^[\u4e00-\u9fa5]+$");
  let str=app.form.realName
  if (str && !reg.test(str)) {
    callback(new Error("姓名只能输入中文"));
  } else {
    callback();
  }
}

let app = new Vue({
  el: '#app',
  data: {
    webName,
    form: {
      nickName: '',
      realName: '',
      sex: '',
      phone: '',
      email: ''
    },
    // 表单校验
    rules: {
      name: [{
        validator: isChn,
        trigger: "blur"
      }],
      email: [{
        required: false,
        validator: watchMail,
        trigger: "blur"
      }]
    }
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
      setHead('个人信息')
    },
    //获取用户信息
    getUserInfo() {
      api.getUserInfo().then(res => {
        const data = res.data || {}
        const {
          nickName,
          realName,
          sex,
          phone,
          email
        } = data
        this.form = {
          nickName: nickName,
          realName: realName,
          sex: sex,
          phone: phone,
          email: email
        }
      })
    },
    //提交
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let {
            nickName,
            realName,
            sex,
            email
          } = this.form
          let param = {
            nickName: nickName,
            realName: realName,
            sex: sex,
            // email: email
          }
          loading()
          api.editUserInfo(param).then(res => {
            toast("提交成功");
            setTimeout(() => {
              this.getUserInfo()
            }, 2000)
          }).catch(err => {
            toast(err)
          })
        }
      })
    }
  }
})