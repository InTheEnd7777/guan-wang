//获取参数
let catid = getParams('catid') || '1',
  page = getParams('page') || 1
let app = new Vue({
  el: '#app',
  data: {
    webName,
    isShow: false,
    infoList: [],
    recShow: false,
    recList: [],
    catid: catid,
    current: Number(page),
    size: 6,
    pages: 0,
    total: 0,
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
    userInfo: {}
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.setTitle()
      if (getToken()) {
        this.getUserInfo()
      } else {
        this.getInfoList()
        this.getRecList()
      }
    },
    //修改标题
    setTitle() {
      const tag = this.tags[catid]
      document.title = `${tag}${page==1?'':'-第'+page+'页-'}-${webName.title}`
    },
    //获取用户信息
    getUserInfo() {
      api.getUserInfo().then(res => {
        this.userInfo = res.data || {}
        this.getInfoList()
        this.getRecList()
      })
    },
    // 获取分页列表
    getInfoList() {
      let param = {
        type: this.catid,
        pageNo: this.current,
        pageSize: this.size
      }
      api.getCateList(param).then(res => {
        this.isShow = true
        let data = res.data || {}
        let list = data.result || []
        if (list.length) {
          for (let i of list) {
            i.img = []
            if (i.imageUrl) {
              i.img = i.imageUrl.split(',')
            }
          }
        }
        this.infoList = list
        this.pages = Number(data?.total || 0)
        this.getPages()
      })
    },
    //获取推荐信息
    getRecList() {
      let param = {
        pageNo: page,
        pageSize: this.size
      }
      api.getRecList(param).then(res => {
        this.recShow = true
        let data = res.data || {}
        let list = data.result || []
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
    //设置分页
    getPages() {
      $("#pagination").pagination({
        currentPage: this.current,
        totalPage: this.pages, //总分页数
        isShow: false,
        count: 3, //显示几个按钮tab
        // prevPageText: "< 上一页",
        // nextPageText: "下一页 >",
        callback: (current) => {
          let url = `./category.html?catid=${this.catid}&page=${current}`
          location.href = url
        }
      });
      //设置分页选中
      $(`a[data-current=${this.current}]`).addClass('active')
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
    }
  }
})