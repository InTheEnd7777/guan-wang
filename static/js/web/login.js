let app = new Vue({
  el: '#app',
  data: {
    webName,
    keywords: '',
    isRemember: false,
    form: {
      username: "",
      password: "",
      code: "",
      key: "",
      img: "",
      cryptoKey: {},
    },
    rules: {
      username: [{
          required: true,
          message: "请输入手机号码",
          trigger: "blur"
        },
        // {hzbh01
        //   min: 11,
        //   max: 11,
        //   message: '手机号码格式不对',
        //   trigger: "blur"
        // },
        // {
        //   pattern: /^[1][0-9][0-9]{9}$/,
        //   message: '请输入正确的手机号码',
        //   trigger: "blur"
        // }
      ],
      password: [{
        required: true,
        trigger: "blur",
        message: "请输入密码"
      }],
      code: [{
        required: true,
        trigger: "blur",
        message: "请输入图形验证码"
      }]
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.setTitle()
      this.getImgCode()
      this.checkRemember()
    },
    // 设置标题
    setTitle() {
      document.title = `登录-${webName.title}`
    },
    //搜索
    search() {
      const keywords = this.keywords.trim()
      const url = keywords ? `./searchlist.html?keywords=${keywords}` : './search.html'
      location.href = url
    },
    //输入数字
    setNumber(val) {
      // val = val.replace(/[^\d]/g, '')
      this.form.username = val
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
          this.form.key = captchaId
        })
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
            this.passLogin()
          })
        }
      })
    },
    //账号密码登录
    passLogin() {
      let {
        username,
        password,
        code,
        key,
        cryptoKey
      } = this.form
      let param = {
        captcha: {
          captchaId: key,
          captchaValue: code
        },
        password: aesEncrypt(password),
        phone: username,
        token: cryptoKey.token
      }
      //记住密码
      if (this.isRemember) {
        localStorage.isRemember = '1';
        localStorage.username = username;
        //加密
        localStorage.password = base64Encode(password);
      } else {
        localStorage.removeItem('isRemember')
        localStorage.removeItem('username')
        localStorage.removeItem('password')
      }
      loading()
      api.login(param).then(res => {
        loadhide()
        let {
          token
        } = res.data || {}
        if (token) {
          localStorage.userInfo = JSON.stringify(res?.data || {})
          localStorage.token = token
        }
        location.replace('./index.html')
      }).catch(err => {
        toast(err)
        this.getImgCode()
      })
    },
    goUrl(url) {
      location.replace(url)
    },
    // 设置记住密码
    setRemember() {
      if (this.isRemember) {
        localStorage.isRemember = '1'
      } else {
        localStorage.removeItem('isRemember')
      }
    },
    // 判断记住密码
    checkRemember() {
      const remember = localStorage.isRemember;
      if (remember) {
        this.isRemember = true;
        this.form.username = localStorage.username;
        //解密
        this.form.password = base64Decode(localStorage.password);
      } else {
        this.isRemember = false;
      }
    }
  }
})