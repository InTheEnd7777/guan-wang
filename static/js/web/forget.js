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
    keywords: '',
    form: {
      phone: '',
      msgCode: '',
      newPassword: '',
      confirmPassword: '',
      img: '',
      imgKey: '',
      imgCode: '',
      cryptoKey: {},
    },
    sendtxt: '发送验证码',
    disabled: 0,
    second: 0,
    interval: '', //验证码
    // 表单校验
    rules: {
      phone: [{
          required: true,
          message: "请输入手机号码",
          trigger: "blur"
        },
        {
          min: 11,
          max: 11,
          message: '手机号码格式不对',
          trigger: "blur"
        },
        {
          pattern: /^[1][0-9][0-9]{9}$/,
          message: '请输入正确的手机号码',
          trigger: "blur"
        }
      ],
      msgCode: [{
        required: true,
        trigger: "blur",
        message: "请输入验证码"
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
    this.setTitle()
    this.getImgCode()
  },
  methods: {
    //设置标题
    setTitle() {
      document.title = `忘记密码-${webName.title}`
    },
    //搜索
    search() {
      const keywords = this.keywords.trim()
      const url = keywords ? `./searchlist.html?keywords=${keywords}` : './search.html'
      location.href = url
    },
    //输入数字
    setNumber(val) {
      val = val.replace(/[^\d]/g, '')
      this.form.phone = val
    },
    //输入数字
    setNumber2(val) {
      val = val.replace(/[^\d]/g, '')
      this.form.msgCode = val
    },
    //图形验证码
    getImgCode() {
      api.getImgCode()
        .then(res => {
          const {
            captchaData,
            captchaId
          } = res.data || {}
          this.form.img = "data:image/png;base64," + captchaData;
          this.form.imgKey = captchaId
        })
    },
    //短信验证码
    sendMsg() {
      let phone = this.form.phone;
      this.second = 60;
      if (phone == "") {
        layer.msg("请输入您的手机号", "error");
        return;
      }
      if (phone.length != 11) {
        layer.msg("手机号格式不对", "error");
        return;
      }
      let param = {
        phone,
        type: 2 //1注册 2忘记密码
      }
      api.getMsgCode(param).then(res => {
        this.disabled = 1
        layer.msg("验证码已发送")
        this.sendtxt = this.second + "S";
        this.interval = setInterval(this.remainTime, 1000);
        //本地获取验证码
        if (WebTest) {
          api.getMsgCode2({
            phone
          })
        }
      }).catch(err => {
        toast(err)
      })
    },
    //倒计时
    remainTime() {
      if (this.second == 0) {
        clearInterval(this.interval);
        this.disabled = 0, this.sendtxt = "重发验证码";
      } else {
        this.second--;
        this.sendtxt = this.second + "S"
      }
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
            this.forgetPwd()
          })
        }
      })
    },
    //忘记密码
    forgetPwd() {
      let {
        phone,
        msgCode,
        newPassword,
        imgKey,
        imgCode,
        cryptoKey
      } = this.form
      let param = {
        captcha: {
          captchaId: imgKey,
          captchaValue: imgCode
        },
        newPassword: aesEncrypt(newPassword),
        phone,
        smsCode: msgCode,
        token: cryptoKey.token
      }
      loading()
      api.pwdForget(param).then(res => {
        toast("密码修改成功");
        clearToken()
        setTimeout(() => {
          location.replace("./login.html")
        }, 2000)
      }).catch(err => {
        toast(err)
        this.getImgCode()
      })
    },
    goUrl(url) {
      console.log(url)
      location.replace(url)
    }
  }
})