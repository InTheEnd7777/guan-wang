//获取参数
const watchDate = (rule, value, callback) => {
  if (app.form.type && !value) {
    callback(new Error('请选择置顶天数'));
  } else {
    callback();
  }
};
let app = new Vue({
  el: '#app',
  data: {
    webName,
    isShow: false,
    info: {},
    recShow: false,
    recList: [],
    id: getParams('id') || '',
    tags: {
      '网页搭建': 1,
      '软件定制': 2,
      'UI设计': 3,
      'APP研发': 4,
      1: '网页搭建',
      2: '软件定制',
      3: 'UI设计',
      4: 'APP研发'
    },
    userInfo: {},
    coinsInfo: {},
    //置顶s
    isAlert1: false,
    typeArr: [{
        label: '上首页',
        value: '1',
      },
      {
        label: '大类置顶',
        value: '2',
      }
    ],
    timeArr: {
      // 上首页
      1: [{
          label: '1天',
          value: '1',
          coins: 3
        },
        {
          label: '7天',
          value: '7',
          coins: 21
        },
        {
          label: '14天',
          value: '14',
          coins: 42
        },
        {
          label: '30天',
          value: '30',
          coins: 90
        },
        {
          label: '90天',
          value: '90',
          coins: 270
        },
        {
          label: '365天',
          value: '365',
          coins: 1095
        }
      ],
      // 大类置顶
      2: [{
          label: '1天',
          value: '1',
          coins: 2
        },
        {
          label: '7天',
          value: '7',
          coins: 14
        },
        {
          label: '14天',
          value: '14',
          coins: 28
        },
        {
          label: '30天',
          value: '30',
          coins: 60
        },
        {
          label: '90天',
          value: '90',
          coins: 180
        },
        {
          label: '365天',
          value: '365',
          coins: 730
        }
      ]
    },
    form: {
      title: '',
      type: '', //类型 1上首页 2大类置顶
      date: '', //天数 
      coins: 0
    },
    rules: {
      type: [{
        required: true,
        message: "请选择置顶类型",
        trigger: "change"
      }],
      date: [{
        required: true,
        validator: watchDate,
        trigger: ["blur", "change"]
      }]
    },
    //置顶e
    //举报s
    isAlert2: false,
    isReport: true,
    type2Arr: [{
        label: '违法信息',
        value: '1',
      },
      {
        label: '分类错误',
        value: '2',
      },
      {
        label: '虚假信息',
        value: '3',
      },
      {
        label: '其他原因',
        value: '4',
      }
    ],
    form2: {
      id: '',
      title: '',
      type: '', //举报类型 1上首页 2大类置顶
      mask: ''
    },
    rules2: {
      type: [{
        required: true,
        message: "请选择举报类型",
        trigger: "change"
      }],
      mask: [{
        required: true,
        message: "请输入情况说明",
        trigger: "blur"
      }]
    }
    //举报e
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (getToken()) {
        this.getUserInfo()
      } else {
        this.getDetail()
        this.getSimilarList()
      }
    },
    //修改标题
    setTitle() {
      const {
        info,
        tags,
      } = this
      const tag = tags[info.type]
      let title = `${info.title}-${tag}-${webName.title}`
      document.title = title
    },
    //获取用户信息
    getUserInfo() {
      api.getUserInfo().then(res => {
        this.userInfo = res.data || {}
        this.getDetail()
        this.getSimilarList()
      })
    },
    // 获取详情
    getDetail() {
      let id = this.id
      if (!id) {
        return
      }
      let param = {
        topicId: id
      }
      api.getPostInfo(param).then(res => {
        this.isShow = true
        let data = res.data || {}
        let content=data.content
        if(content){
          data.content = content.replace(/\n/g, '<br />')
        }
        data.img = data.imageUrl ? data.imageUrl.split(',') : []
        data.isCollect = data.isCollect == 1 ? true : false
        this.info = data
        this.setTitle()
      }).catch(err => {
        toast(err)
        console.log(err)
        if (err.indexOf('删除') > -1 || err.indexOf('不存在') > -1) {
          setTimeout(() => {
            location.replace('./index.html')
          }, 2000)
        }
      })
    },
    //获取您可能感兴趣
    getSimilarList() {
      let param = {
        topicId: this.id
      }
      api.getSimilarList(param).then(res => {
        this.recShow = true
        let list = res.data || []
        if (list.length) {
          for (let i of list) {
            i.img = []
            if (i.imageUrl) {
              i.img = i.imageUrl.split(',')
            }
          }
        }
        this.recList = list
      })
    },
    //退出登录
    logOut() {
      layer.confirm('确定要退出登录吗？', {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        console.log('确定')
        layer.closeAll()
        quitLogin()
      }, (index) => {});
    },
    //信息收藏
    postCollect() {
      let {
        id,
        isCollect,
        collectId
      } = this.info
      if (isCollect) {
        //取消收藏
        isCollect = false
      } else {
        //收藏
        isCollect = true
      }
      if (isCollect) {
        //收藏
        let param = {
          topicId: this.id
        }
        loading()
        api.addCollect(param).then(res => {
          this.getDetail()
          
          this.info.isCollect = isCollect
          let title = `恭喜！已成功收藏到个人中心—收藏列表中！<br/>查看 <a href="./mycollect.html" target="_blank">收藏列表>></a>`
          layer.confirm(title, {
            title: "提示",
            btn: ['确定']
          }, () => {
            layer.closeAll()
          }, (index) => {});
        }).catch(err => {
          toast(err)
        })
      } else {
        //取消收藏
        loading()
        api.delCollect([collectId]).then(res => {
          this.info.isCollect = isCollect
          toast('已成功取消收藏')
        }).catch(err => {
          toast(err)
        })
      }
    },
    //信息删除
    postDel() {
      const id = this.info.id
      layer.confirm('确定要删除该信息吗？', {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        layer.closeAll()
        let param = {
          id: id
        }
        loading()
        api.delPost(param).then(res => {
          toast("删除成功");
          setTimeout(() => {
            location.replace('./index.html')
          }, 2000)
        }).catch(err => {
          toast(err)
        })
      }, (index) => {});
    },
    //信息修改
    postEdit() {
      const id = this.info.id
      window.open(`./addpost.html?id=${this.info.id}`)
    },
    //置顶s
    //置顶弹窗-显示
    showAlert1(row) {
      this.isAlert1 = true
      setTimeout(() => {
        //延迟有时去不了
        this.$refs.form?.clearValidate()
      }, 0)
      const info = this.info
      this.form = {
        id: info.id,
        title: info.title,
        type: '',
        date: '',
        coins: 0
      }
    },
    //监听类别
    changeType() {
      this.changeDate()
    },
    //监听时长
    changeDate() {
      let {
        type,
        date
      } = this.form
      let list = this.timeArr[type]
      let coins = 0
      for (let i of list) {
        if (i.value == date) {
          coins = i.coins
          break
        }
      }
      this.form.coins = coins
    },
    hideAlert() {
      this.isAlert1 = false
      this.$refs.form?.clearValidate()
    },
    //取消置顶
    topDel(id) {
      layer.confirm('确定要取消置顶该信息吗？', {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        let param = {
          id: id
        }
        loading()
        api.topDel(param).then(res => {
          toast("取消置顶成功");
          this.init()
        }).catch(err => {
          toast(err)
        })

      }, (index) => {});
    },
    //提交置顶
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let form = this.form
          let {
            type,
            date
          } = form

          let coins = Number(app.userInfo.coins || 0),
            coins2 = Number(app.form.coins)
          if (coins2 > coins) {
            toast('您的账户金币不足，请先充值')
            return
          }
          let param = {
            dayCounts: date,
            id: 0,
            topicId: this.id,
            type
          }
          loading()
          api.topPost(param).then(res => {
            toast("主题置顶成功");
            this.isAlert1 = false
            this.init()
          }).catch(err => {
            toast(err)
          })
        }
      })
    },
    //置顶e
    //举报s
    //举报弹窗-显示
    showAlert2(row) {
      this.isAlert2 = true
      this.isReport = true
      this.$refs.form2?.clearValidate()
      const {
        title
      } = this.info
      this.form2 = {
        title: title,
        type: '',
        mask: ''
      }
    },
    hideAlert2() {
      this.isAlert2 = false
      this.$refs.form2?.clearValidate()
    },
    //举报提交
    submit2() {
      this.$refs.form2.validate(valid => {
        if (valid) {
          let {
            type,
            mask
          } = this.form2
          let param = {
            id: this.id,
            type,
            mask
          }
          api.reportPost(param).then(res => {
            this.isReport = false
          }).catch(err => {
            toast(err)
          })
        }
      })
    },
    //举报e
  }
})