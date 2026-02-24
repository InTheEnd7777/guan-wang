const watchPwd = (rule, value, callback) => {
  // 至少包含一个数字、一个字母和一个特殊符号
  const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$/;
  if (!reg.test(value)) {
    callback(new Error("密码必须包含数字、字母、特殊字符"));
  } else {
    callback();
  }
}

const equalToPassword = (rule, value, callback) => {
  if (app.form.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

let app = new Vue({
  el: '#app',
  data: {
    webName,
    userId: '',
    form: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      cryptoKey: {},
    },
    // 表单校验
    rules: {
      oldPassword: [{
        required: true,
        trigger: "blur",
        message: "请输入当前密码"
      }],
      newPassword: [{
          required: true,
          message: "新密码不能为空",
          trigger: "blur"
        },
        {
          min: 7,
          max: 16,
          message: "密码长度在 7 到 16 个字符",
          trigger: "blur"
        },
        {
          required: true,
          validator: watchPwd,
          trigger: "blur"
        }
      ],
      confirmPassword: [{
          required: true,
          message: "确认密码不能为空",
          trigger: "blur"
        },
        {
          required: true,
          validator: equalToPassword,
          trigger: "blur"
        }
      ]
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
    },
    //设置标题
    setTitle() {
      document.title = `个人中心-${webName.title}`
      setHead('更换密码')
    },
    //获取加密秘钥
    getKey() {
      this.$refs.form.validate(valid => {
        if (valid) {
          api.getEncryptKey().then(res => {
            let data = res.data
            const {
              iv,
              key
            } = data
            this.form.cryptoKey = data
            setCryptoKey(iv, key)
            this.updatePwd()
          })
        }
      })
    },
    //更换密码
    updatePwd() {
      let {
        oldPassword,
        newPassword,
        cryptoKey
      } = this.form
      let param = {
        oldPassword: aesEncrypt(oldPassword),
        newPassword: aesEncrypt(newPassword),
        token: cryptoKey.token
      }
      loading()
      api.pwdEditor(param).then(res => {
        toast("密码修改成功");
        clearToken()
        setTimeout(() => {
          location.replace("./login.html")
        }, 2000)
      }).catch(err => {
        toast(err)
      })
    },
    goUrl(url) {
      console.log(url)
      location.replace(url)
    }
  }
})