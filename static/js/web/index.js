let app = new Vue({
  el: '#app',
  data: {
    webName,
    isShow: false,
    cateList1: [],
    cateList2: [],
    cateList3: [],
    cateList4: [],
    recShow: false,
    recList: [],
    newShow: false,
    newList: [],
    current: 1,
    size: 99999,
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
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.setTitle()
      this.getUserInfo()
      this.getRecList()
      this.getNewList()
      this.getCateList1()
      this.getCateList2()
      this.getCateList3()
      this.getCateList4()
      this.setSwiper()
    },
    // 设置标题
    setTitle() {
      document.title = `${webName.title}`
    },
    //获取用户信息
    getUserInfo() {
      if (!getToken()) {
        return
      }
      api.getUserInfo().then(res => {
        this.userInfo = res.data || {}
      })
    },
    // 轮播
    setSwiper() {
      var mySwiper = new Swiper('.pc-slide .swiper-container', {
        autoplay: 5000,
        loop: true
      })
      $('.arrow-left,.preview .arrow-left').on('click', function(e) {
        e.preventDefault();
        mySwiper.swipePrev();
      })
      $('.arrow-right,.preview .arrow-right').on('click', function(e) {
        e.preventDefault();
        mySwiper.swipeNext();
      })
    },
    //推荐信息
    getRecList() {
      let param = {
        pageNo: 1,
        pageSize: 12
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
    //最新发布
    getNewList() {
      api.getNewList().then(res => {
        this.newShow = true
        let list = res.data || []
        if (list.length) {
          for (let i of list) {
            i.img = []
            if (i.imageUrl) {
              i.img = i.imageUrl.split(',')
            }
          }
        }
        this.newList = list
      })
    },
    // 网页搭建列表
    getCateList1() {
      let param = {
        type: 1,
        pageNo: 1,
        pageSize: 4
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
        this.cateList1 = list
      })
    },
    // 软件定制列表
    getCateList2() {
      let param = {
        type: 2,
        pageNo: 1,
        pageSize: 4
      }
      api.getCateList(param).then(res => {
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
        this.cateList2 = list
      })
    },
    // UI设计列表
    getCateList3() {
      let param = {
        type: 3,
        pageNo: 1,
        pageSize: 4
      }
      api.getCateList(param).then(res => {
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
        this.cateList3 = list
      })
    },
    // APP研发列表
    getCateList4() {
      let param = {
        type: 4,
        pageNo: 1,
        pageSize: 4
      }
      api.getCateList(param).then(res => {
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
        this.cateList4 = list
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
        //返回首页
        quitLogin(1)
      }, (index) => {});
    }
  }
})