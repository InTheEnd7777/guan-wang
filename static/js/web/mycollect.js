let app = new Vue({
  el: '#app',
  data: {
    pgIndex: 1,
    pgSize: 6,
    pgTotal: 0,
    pgData: [],
    delList: [],
    delIds: []
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
      this.getData()
    },
    setTitle() {
      document.title = `个人中心-${webName.title}`
      setHead('收藏列表')
    },
    //获取数据
    getData() {
      let param = {
        pageNo: this.pgIndex,
        pageSize: this.pgSize
      }

      api.collectList(param).then(res => {
        const data = res.data
        console.log(data?.result || [])
        this.pgData = data?.result || []
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
    },
    //分页切换
    pgChange(i) {
      this.pgIndex = i
      this.getData()
    },
    // 多选框选中数据
    selChange(sel) {
      this.delList = sel
      this.delIds = sel.map(item => Number(item.id));
    },
    //多选删除
    showDel() {
      let ids = this.delIds
      if (!ids.length) {
        toast('请选择要删除的信息')
        return
      }
      layer.confirm('确定要删除选中的信息吗？', {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        this.delCollect(ids)
      }, (index) => {});
    },
    //单个删除
    oneDel(id) {
      console.log(id)
      layer.confirm('确定要删除该信息吗？', {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        this.delCollect([Number(id)])
      }, (index) => {});
    },
    //删除收藏
    delCollect(ids) {
      loading()
      api.delCollect(ids).then(res => {
        toast("删除成功")
        setTimeout(() => {
          this.delList = []
          this.delIds = []
          //清除多选
          this.$refs.table1.clearSelection()
          this.research()
        }, 0)
      }).catch(err => {
        toast(err)
      })
    },
    goUrl(id) {
      console.log(id, `./information.html?id=${id}`)
      window.open(`./information.html?id=${id}`)
    }
  }
})