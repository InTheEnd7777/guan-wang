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
    active: getParams('tab') || '1',
    userInfo: {},
    pgIndex: 1,
    pgSize: 10,
    pgTotal: 0,
    pgData: [],
    status: 1, // 1已通过 2审核中 3推广中
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
      id: '',
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
      this.changeTab({
        name: this.active
      })
      this.getUserInfo()
    },
    setTitle() {
      document.title = `个人中心-${webName.title}`
      setHead('分类主题')
    },
    changeTab(tab) {
      let name = tab.name
      let status = ''
      if (name == '1') {
        status = 1
      } else if (name == '2') {
        status = 2
      } else if (name == '3') {
        status = 3
      }
      this.status = status
      this.pgIndex = 1;
      this.getData()
    },
    //获取用户信息
    getUserInfo() {
      api.getUserInfo().then(res => {
        this.userInfo = res.data || {}
      })
    },
    //获取数据
    getData() {
      const {
        pgIndex,
        pgSize,
        status
      } = this
      let param = {
        pageNo: pgIndex,
        pageSize: pgSize,
        status: status
      }
      api.getMypostList(param).then(res => {
        const data = res.data || {}
        let list = data?.result || []
        if (list.length) {
          for (let i of list) {
            i.img = []
            if (i.imageUrl) {
              i.img = i.imageUrl.split(',')
            }
          }
        }
        this.pgData = list
        this.pages = Number(data?.total || 0)
        this.pgTotal = Number(data?.count || 0)
      })
    },
    //搜索
    research(isone) {
      if (isone != 1) {
        this.pgIndex = 1;
      }
      this.getData();
      this.getUserInfo()
    },
    //分页切换
    pgChange(i) {
      this.pgIndex = i
      this.getData()
    },
    //单个删除
    oneDel(id) {
      layer.confirm('确定要删除该信息吗？', {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        let param = {
          id: id
        }
        loading()
        api.delPost(param).then(res => {
          toast("删除成功");
          this.research()
        }).catch(err => {
          toast(err)
        })

      }, (index) => {});
    },
    //身份证校验
    checkCard() {
      let {
        idCard,
        realName
      } = this.userInfo
      if (!(idCard && realName)) {
        layer.confirm('当前账号未实名认证，发布主题必须填写认证信息！', {
          title: "提示",
          btn: ['确定'],
          icon: false
        }, () => {
          layer.closeAll()
          location.href = `./mycertify.html`
        }, (index) => {});
        return false
      }
      return true
    },
    //发布信息
    addPost() {
      if (this.checkCard()) {
        window.open(`./addpost.html`)
      }
    },
    //修改信息
    postEdit(id) {
      if (this.checkCard()) {
        window.open(`./addpost.html?id=${id}`)
      }
    },
    //置顶弹窗-显示
    showAlert1(row) {
      this.isAlert1 = true
      //清除校验
      this.$refs.form?.clearValidate()
      this.form = {
        id: row.id,
        title: row.title,
        type: '',
        date: '',
        coins: 0
      }
      setTimeout(() => {
        this.$refs.form?.clearValidate()
      }, 0)
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
          this.research()
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
            date,
            id
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
            topicId: id,
            type
          }
          loading()
          api.topPost(param).then(res => {
            toast("主题置顶成功");
            this.isAlert1 = false
            this.research()
          }).catch(err => {
            toast(err)
          })
        }
      })
    },
    // 刷新
    refresh(id) {
      let param = {
        id: id
      }
      loading()
      api.boldPost(param).then(res => {
        toast("主题刷新成功");
        this.research()
      }).catch(err => {
        toast(err)
      })
    },
    // 加粗
    setBold(id) {
      let title = `您当前拥有金币${this.userInfo.coins||0}个，加粗该信息标题将扣除您1个金币`
      layer.confirm(title, {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        let param = {
          id: id
        }
        loading()
        api.boldPost(param).then(res => {
          toast("主题标题已加粗");
          this.research()
        }).catch(err => {
          toast(err)
        })
      }, (index) => {});
    },
    // 套红
    setRed(id) {
      let title = `您当前拥有金币${this.userInfo.coins||0}个，套红该信息标题将扣除您1个金币`
      layer.confirm(title, {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        let param = {
          id: id
        }
        loading()
        api.redPost(param).then(res => {
          toast("主题标题已套红");
          this.research()
        }).catch(err => {
          toast(err)
        })
      }, (index) => {});
    }
  }
})