let app = new Vue({
  el: '#app',
  data: {
    webName,
    keywords: ""
  },
  created() {
    this.setTitle()
  },
  methods: {
    //设置标题
    setTitle() {
      document.title = `信息搜索-${webName.title}`
    },
    //搜索
    search() {
      const keywords = this.keywords.trim()
      const url = keywords ? `./searchlist.html?keywords=${keywords}` : './search.html'
      location.href = url
    }
  }
})