const watchDate = (rule, value, callback) => {
  if (app.form.level && !app.form.date) {
    callback(new Error("请选择升级时长"));
  } else {
    callback();
  }
};

let app = new Vue({
  el: '#app',
  data: {
    webName,
    userId: '',
    userInfo:{
      level:0,
      coins:0
    },
    vipArr: [{
        label: '普通会员',
        value: '1',
      },
      {
        label: '黄金会员',
        value: '2',
      }
    ],
    timeArr: {
      // 普通会员
      1: [{
          label: '一个月',
          value: '1',
          coins: 200
        },
        {
          label: '半年',
          value: '6',
          coins: 1000
        }, {
          label: '一年',
          value: '12',
          coins: 2000
        },
        {
          label: '永久',
          value: '999',
          coins: 4500
        }
      ],
      // 黄金会员
      2: [{
          label: '一个月',
          value: '1',
          coins: 300
        },
        {
          label: '半年',
          value: '6',
          coins: 1600
        }, {
          label: '一年',
          value: '12',
          coins: 3200
        },
        {
          label: '永久',
          value: '999',
          coins: 6400
        }
      ]
    },
    form: {
      level: '',
      date: '',
      coins: ''
    },
    // 表单校验
    rules: {
      level: [{
        required: true,
        trigger: "change",
        message: "请选择级别"
      }],
      date: [{
        required: true,
        trigger: "change",
        validator: watchDate
      }]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      if(!getToken()){
        reLogin()
        return
      }
      this.setTitle()
      this.getUserInfo()
    },
    //设置标题
    setTitle() {
      document.title = `个人中心-${webName.title}`
      setHead('帐号升级')
    },
    //获取用户信息
    getUserInfo() {
      api.getUserInfo().then(res => {
        const data = res.data || {}
        this.userInfo = data
      })
    },
    //监听级别
    changeLevel(){
      this.changeDate()
    },
    //监听时长
    changeDate(){
      let {level,date}=this.form
      let list=this.timeArr[level]
      let coins=''
      for(let i of list){
        if(i.value==date){
          coins=i.coins
          break
        }
      }
      this.form.coins=coins
    },
    //帐号升级
    updateLevel() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let form = this.form
          let {
            level,
            date,
            coins
          } = form
          let param = {
            level: level,
            date: date,
            coins: coins
          }
          console.log(param)
          if(Number(this.userInfo.coins)<Number(coins)){
            toast("您的账户金币不足，请先充值");
            return
          }
          loading()
          api.updateLevel(param).then(res => {
            toast("账号升级成功");
            setTimeout(() => {
              this.getUserInfo()
            }, 2000)
          }).catch(err => {
            toast(err)
          })
        }
      })
    },
    goUrl(url) {
      console.log(url)
      location.replace(url)
    }
  }
})