const watchCoins = (rule, value, callback) => {
  if (Number(app.form.coins) < 1) {
    callback(new Error("至少充值1金币"));
  } else {
    callback();
  }
};
let app = new Vue({
  el: '#app',
  data: {
    active: getParams('tab') || '1',
    pgTab: [1, 0],
    // tab1
    first: 1,
    isAlert: false,
    QRCode: '',
    userInfo: {},
    orderId: '',
    timer: null,
    form: {
      coins: '',
      money: '',
      type: '1'
    },
    rules: {
      coins: [{
          required: true,
          message: "请输入要充值的金币数",
          trigger: "blur"
        },
        {
          required: true,
          validator: watchCoins,
          trigger: ["blur", "change"]
        }
      ]
    },
    isAlert2: false,
    bankInfo: {},
    form2: {},
    // tab2
    pgIndex: 1,
    pgSize: 10,
    pgTotal: 0,
    pgData: [],
    delList: [],
    delIds: [],
    // tab3
    pgIndex2: 1,
    pgSize2: 10,
    pgTotal2: 0,
    pgData2: [],
    delList2: [],
    delIds2: [],

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
      this.resetForm()
      this.getUserInfo()
      this.changeTab({
        name: this.active
      })
    },
    setTitle() {
      document.title = `个人中心-${webName.title}`
      setHead('金币充值')
    },
    //重置表单
    resetForm() {
      this.form.coins = '10'
      this.form.money = '5'
    },
    changeTab(tab) {
      let name = tab.name
      this.pgTab = ['opac-0', 'opac-0']
      if (name == '1') {
        //清除校验
        this.$refs.form?.clearValidate()
      } else if (name == '2') {
        this.getData()
        //去表格切换闪烁
        setTimeout(() => {
          this.pgTab = ['', 'opac-0']
        }, 50)
      } else if (name == '3') {
        this.getData2()
        setTimeout(() => {
          this.pgTab = ['opac-0', '']
        }, 50)
      }
    },
    //tab1部分
    //获取用户信息
    getUserInfo() {
      api.getUserInfo().then(res => {
        this.userInfo = res.data || {}
      })
    },
    //输入0和正整数
    setNumber(val) {
      val = val.replace(/[^0-9]/g, '')
      val = Number(val)
      this.form.coins = val + ''
      if (val >= 1) {
        this.form.money = val / 2
      } else {
        this.form.money = 5
      }
    },
    //生成订单
    paySubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let {
            type
          } = this.form
          if (type == '1') {
            this.orderId = ''
            let param = {
              coinsCounts: this.form.coins,
              returnUrl: location.href,
              payType:2,
            }
            loading()
            api.coinsRecharge(param).then(res => {
              loadhide()
              const data = res.data || {}
              const {
                payInfo,
                orderNo
              } = data
              // 支付宝链接
              // window.open(payInfo)
              this.orderId = orderNo
              this.getState()
              //生成二维码
              this.isAlert = true
              this.codeInit(payInfo)
            }).catch(err => {
              toast(err)
              //维护时显示对公转账
              this.showBankInfo()
            })
          } else if (type == '2') {
            this.showBankInfo()
          }
        }
      })
    },
    //获取订单状态
    getState() {
      this.timer = setInterval(() => {
        let param = {
          orderNo: this.orderId
        }
        api.queryRechargeStatus(param).then(res => {
          const data = res.data
          // 充值状态：1成功 0失败 2充值中
          if (data == 1) {
            clearInterval(this.timer)
            toast('支付成功')
            this.isAlert=false
            this.init()
          } else if (data == 0) {
            clearInterval(this.timer)
            this.isAlert=false
            toast('支付失败')
          }
        }).catch(err => {
          toast(err)
        })
      }, 5000)
    },
    //二维码初始化
    codeInit(text) {
      if (this.first) {
        this.first = 0
        setTimeout(() => {
          this.qrCode = new QRCode("qrcode", {
            text,
            width: 360,
            height: 360
          })
        }, 0)
      } else {
        this.codeCreate(text)
      }
    },
    //二维码重新生成
     codeCreate(url) {
      //清除缓存
      this.qrCode.clear();
      //重置二维码
      this.qrCode.makeCode(url);
    },
    //取消支付-在线
    hidePay() {
      loading();
      try {
         api.cancelRecharge({orderNo: this.orderId}).then(res => {
      }).catch(err => {
        toast(err)
      })
         
      } catch (error) {
        
      } finally {
        loadhide()
         this.isAlert = false
      clearInterval(this.timer)
      }
     
    
    },
    //显示对公账户
    showBankInfo() {
      this.isAlert2 = true
      api.companyTransferInfo().then(res => {
        const data = res.data || {}
        this.bankInfo = data
      }).catch(err => {
        toast(err)
      })
    },
    //取消支付-对公
    hidePay2() {
      this.isAlert2 = false
    },
    //tab2部分
    //充值记录
    getData() {
      let param = {
        pageNo: this.pgIndex,
        pageSize: this.pgSize
      }
      api.pageCoinsRecharge(param).then(res => {
        const data = res.data || {}
        this.pgData = data.result || []
        this.pgTotal = Number(data.count || 0)
      })
    },
    //搜索
    research(isone) {
      if (isone != 1) {
        this.pgIndex = 1;
      }
      this.getData();
    },
    //分页切换
    pgChange(i) {
      this.pgIndex = i
      this.getData()
    },
    //tab3部分
    //消费记录
    getData2() {
      let param = {
        pageNo: this.pgIndex2,
        pageSize: this.pgSize2
      }
      api.pageConsumption(param).then(res => {
        const data = res.data || {}
        let list = data.result || []
        if (list.length) {
          for (let i of list) {
            let log = i.operationLog
            if (log) {
              i.operationLog = JSON.parse(log)
            }
          }
        }
        this.pgData2 = list
        this.pgTotal2 = Number(data.count || 0)
      })
    },
    //搜索
    research2(isone) {
      if (isone != 1) {
        this.pgIndex2 = 1;
      }
      this.getData2();
    },
    //分页切换
    pgChange2(i) {
      this.pgIndex2 = i
      this.getData2()
    }
  }
})