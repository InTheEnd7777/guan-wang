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
    active: '1',
    pgTab: [1, 0],
    // tab1
    pgIndex: 1,
    pgSize: 10,
    pgTotal: 0,
    pgData: [
      // {
      // id: '1',
      // title: '18258037381,您好,感谢您的注册,请阅读以下内容',
      // from: 'admin',
      // createTime: '2025-10-28 09:13:35',
      // content: '尊敬的18258037381,您已经注册成为杭州趣看文化传媒有限公司的会员,请您在发表言论时,遵守当地法律法规。 如果您有什么疑问可以联系管理员。 杭州趣看文化传媒有限公司 2025-10-28 09:13:35'
      // },
    ],
    delList: [],
    delIds: [],
    isAlert: false,
    msgInfo: {},
    // tab2
    pgIndex2: 1,
    pgSize2: 10,
    pgTotal2: 0,
    pgData2: [
      // {
      // id: '1',
      // title: '18258037381,您好,感谢您的注册,请阅读以下内容',
      // from: 'admin',
      // createTime: '2025-10-28 09:13:35',
      // content: '尊敬的18258037381,您已经注册成为杭州趣看文化传媒有限公司的会员,请您在发表言论时,遵守当地法律法规。 如果您有什么疑问可以联系管理员。 杭州趣看文化传媒有限公司 2025-10-28 09:13:35'
      // },
    ],
    delList2: [],
    delIds2: [],
    isAlert2: false,
    msgInfo2: {},
    // tab3
    form: {
      phone: '',
      title: '',
      content: ''
    },
    rules: {
      phone: [{
          required: true,
          message: "请输入会员手机号码",
          trigger: "blur"
        },
        {
          min: 11,
          max: 11,
          message: '会员手机号码格式不对',
          trigger: "blur"
        },
        {
          pattern: /^[1][0-9][0-9]{9}$/,
          message: '请输入正确的会员手机号码',
          trigger: "blur"
        }
      ],
      title: [{
        required: true,
        message: "请输入标题",
        trigger: "blur"
      }],
      content: [{
        required: true,
        message: "请输入内容",
        trigger: "blur"
      }],
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if(!getToken()){
        reLogin()
        return
      }
      this.setTitle()
      this.getData()
    },
    setTitle() {
      document.title = `个人中心-${webName.title}`
      setHead('短消息')
    },
    changeTab(tab) {
      let name = tab.name
      this.pgTab = ['opac-0', 'opac-0']
      if (name == '1') {
        this.getData()
        //去表格切换闪烁
        setTimeout(()=>{
          this.pgTab = ['', 'opac-0']
        },50)
      } else if (name == '2') {
        this.getData2()
        setTimeout(()=>{
          this.pgTab = ['opac-0', '']
        },50)
      } else if (name == '3') {
        //清除校验
        this.$refs.form.clearValidate()
      }

    },
    //tab1部分
    //获取数据
    getData() {
      let param = {
        page: this.pgIndex,
        pagesize: this.pgSize
      }
      console.log(param)
      //测试
      this.pgData = [{
          id: '1',
          title: '18258037381,您好,感谢您的注册,请阅读以下内容',
          from: 'admin',
          createTime: '2025-10-28 09:13:35',
          content: '尊敬的18258037381,您已经注册成为杭州趣看文化传媒有限公司的会员,请您在发表言论时,遵守当地法律法规。 如果您有什么疑问可以联系管理员。 杭州趣看文化传媒有限公司 2025-10-28 09:13:35尊敬的18258037381,您已经注册成为杭州趣看文化传媒有限公司的会员,请您在发表言论时,遵守当地法律法规。 如果您有什么疑问可以联系管理员。 杭州趣看文化传媒有限公司 2025-10-28 09:13:35'
        },
        {
          id: '2',
          title: '18258037382,您好',
          from: 'admin2',
          createTime: '2025-10-29 09:13:35',
          content: '请您在发表言论时'
        }
      ];
      this.pgTotal = 30
      return

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
    // 多选框选中数据
    selChange(sel) {
      this.delList = sel
      this.delIds = sel.map(item => item.id);

      console.log(sel, this.delIds)
    },
    //消息弹窗
    showAlert(row) {
      this.isAlert = true
      this.msgInfo = row
    },
    showDel() {
      let ids = this.delIds
      if (!ids.length) {
        toast('请选择要删除的消息')
        return
      }
      layer.confirm('确定要删除选中的消息吗？', {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        console.log('确定')
        layer.closeAll()
        toast("删除成功")
        setTimeout(() => {
          this.delList = []
          this.delIds = []
          //清除多选
          this.$refs.table1.clearSelection()
          this.research()
        }, 2000)
      }, (index) => {});
    },

    //tab2部分
    //获取数据
    getData2() {
      let param = {
        page: this.pgIndex2,
        pagesize: this.pgSize2
      }
      console.log(param)
      //测试
      this.pgData2 = [{
          id: '1',
          title: '17258037381,您好,感谢您的注册,请阅读以下内容',
          from: 'admin7',
          createTime: '2025-11-28 09:13:35',
          content: '尊敬的18258037381,您已经注册成为杭州趣看文化传媒有限公司的会员,请您在发表言论时,遵守当地法律法规。 如果您有什么疑问可以联系管理员。 杭州趣看文化传媒有限公司 2025-10-28 09:13:35尊敬的18258037381,您已经注册成为杭州趣看文化传媒有限公司的会员,请您在发表言论时,遵守当地法律法规。 如果您有什么疑问可以联系管理员。 杭州趣看文化传媒有限公司 2025-10-28 09:13:35'
        },
        {
          id: '2',
          title: '17258037382,您好',
          from: '7admin2',
          createTime: '2025-1-29 09:13:35',
          content: '请您在发表言论时'
        }
      ];
      this.pgTotal2 = 30
      return

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
    },
    // 多选框选中数据
    selChange2(sel) {
      this.delList2 = sel
      this.delIds2 = sel.map(item => item.id);

      console.log(sel, this.delIds2)
    },
    //消息弹窗
    showAlert2(row) {
      this.isAlert2 = true
      this.msgInfo2 = row
    },
    showDel2() {
      let ids = this.delIds2
      if (!ids.length) {
        toast('请选择要删除的消息')
        return
      }
      layer.confirm('确定要删除选中的消息吗？', {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        console.log('确定')
        layer.closeAll()
        toast("删除成功")
        setTimeout(() => {
          this.delList2 = []
          this.delIds2 = []
          //清除多选
          this.$refs.table2.clearSelection()
          this.research2()
        }, 2000)
      }, (index) => {});
    },

    //tab3部分
    //输入数字
    setNumber(val) {
      val = val.replace(/[^\d]/g, '')
      this.form.phone = val
    },
    //发送消息
    sendMsg() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let {
            phone,
            title,
            content
          } = this.form
          let param = {
            phone: phone,
            title: title,
            content: content
          }
          console.log(param)
          toast("提交成功")
          setTimeout(() => {
            this.form = {
              phone: '',
              title: '',
              content: ''
            }
          }, 2000)
        }
      })
    },
  }
})