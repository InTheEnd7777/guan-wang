let app = new Vue({
  el: '#app',
  data: {
    webName,
    isShow: false,
    list: [],
    keyOld: "",
    keywords: "",
    keywords2: "",
    type: getParams('type') || "",
    date: getParams('date') || "",
    tel: getParams('tel') || "",
    current: Number(getParams('page') || 1),
    size: 10,
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
    typeArr: [{
        label: '全部',
        value: '',
      }, {
        label: '网页搭建',
        value: '1',
      },
      {
        label: '软件定制',
        value: '2',
      },
      {
        label: 'UI设计',
        value: '3',
      },
      {
        label: 'APP研发',
        value: '4',
      }
    ],
    timeArr: [{
        label: '全部',
        value: '',
      }, {
        label: '3天内',
        value: '3'
      },
      {
        label: '1周内',
        value: '7'
      },
      {
        label: '1个月内',
        value: '30'
      },
      {
        label: '3个月内',
        value: '90'
      }
    ],
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let keyOld = getParams("keywords") || ""
      this.keyOld = keyOld
      this.keywords = keyOld
      this.keywords2 = keyOld
      this.setTitle()
      this.getList()
    },
    //设置标题
    setTitle() {
      let {
        keyOld
      } = this
      document.title = `${keyOld?keyOld+'-':''}主题搜索-${webName.title}`
    },
    //输入数字
    setNumber(e) {
      let val = e.target.value
      val = val.replace(/[^\d]/g, '')
      this.tel = val
    },
    //设置文字变红
    setTxtRed(txt) {
      if (txt === '' || txt === undefined || txt === null) {
        return txt
      }
      let {
        keyOld
      } = this
      const reg = new RegExp(`(${keyOld})`, 'g');
      const val = txt.replace(reg, `<span class="red">${keyOld}</span>`);
      return val
    },
    //搜索
    search() {
      const keywords = this.keywords.trim()
      const url = keywords ? `./searchlist.html?keywords=${keywords}` : './search.html'
      location.href = url
    },
    //详细搜索
    research(current) {
      let {
        keywords2,
        type,
        date,
        tel
      } = this
      const keywords = keywords2.trim()
      let url = `./searchlist.html?keywords=${keywords.trim()}`
      if (type) {
        url += `&type=${type}`
      }
      if (date) {
        url += `&date=${date}`
      }
      if (tel) {
        url += `&tel=${tel}`
      }
      if (current) {
        //分页按钮点击
        url += `&page=${current}`
      } else {
        //搜索点击
        if (!(keywords || type || date || tel)) {
          //全空值跳搜索
          url = './search.html'
        }
      }
      location.href = url
    },
    // 获取分页列表
    getList() {
      let {
        keyOld,
        type,
        date,
        tel,
        current,
        size
      } = this
      let param = {
        keyWord: keyOld,
        type,
        phone: tel,
        pageNo: current,
        pageSize: size,
      }
      if (date) {
        param.startDate = getDay(-date)
        param.endDate = getDay(0)
      }
      //去空key值
      param = delEmptyKeys(param)

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
        this.list = list
        this.pages = Number(data?.total || 0)
        this.total = Number(data?.count || 0)
        this.getPages()
      })
    },
    //设置分页
    getPages() {
      let that = this
      $("#pagination").pagination({
        currentPage: this.current,
        totalPage: this.pages, //总分页数
        isShow: false,
        count: 3, //显示几个按钮tab
        // prevPageText: "< 上一页",
        // nextPageText: "下一页 >",
        callback: (current) => {
          that.research(current)
        }
      });
      //设置分页选中
      $(`a[data-current=${this.current}]`).addClass('active')
    },
  }
})