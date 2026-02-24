let app = new Vue({
  el: '#app',
  data: {
    form: {
      img1: ''
    },
    alertImg: '',
    alertShow: false,
    imgArr1: [],
    imgStr1: [],
    imgUp1: false,
    rules: {
      img1: [{
        required: true,
        message: "请上传头像",
        trigger: ['change']
      }]
    }
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
      this.getUserInfo()
    },
    setTitle() {
      document.title = `个人中心-${webName.title}`
      setHead('更换头像')
    },
    //获取用户信息
    getUserInfo() {
      api.getUserInfo().then(res => {
        const {
          headPic
        } = res.data || {}
        if (headPic) {
          this.form = {
            img1: headPic,
          }
          this.imgArr1 = [{
            name: '1',
            url: headPic
          }]
          this.imgStr1 = headPic
          //替换左侧头像
          $('#myavatar').attr('src', headPic)
        }
        //上传状态清除
        this.imgUp1 = false
        this.imgUp2 = false
      })
    },
    //读取本地图片
    changeImg1(file, list) {
      this.changeImg(file, list, this, 4096, 'imgArr1', 'img1', 'form', 'imgUp1')
    },
    //限制图片大小,//读取本地图片,每次1张回调
    changeImg(file, list, that, size, id, ref, form, change) {
      size = size || 400, form = form || 'form'
      let limit = file.size / 1024,
        imgArr = that.imgArr,
        txt = 'KB'
      if (id) {
        imgArr = that[id]
      }
      let isLtM = limit < size,
        msg = '上传图片大小不能超过' + size + txt + '!'
      const isImage = file.raw.type == "image/png" || file.raw.type == "image/jpg" || file.raw.type ==
        "image/jpeg" || file.raw.type == "image/gif";
      if (!isImage) {
        msg = '上传图片只支持png,jpg,jpeg,gif格式!'
      }
      imgArr.push(file)
      if (!isLtM || !isImage) {
        that.$modal.msgError(msg);
        for (let i in imgArr) {
          //同名，同大小即为超过的图片
          if (imgArr[i].name == file.name && imgArr[i].size == file.size) {
            imgArr.splice(i, 1) //删除图片
          }
        }
      }
      if (id && ref) {
        this[form][ref] = this[id]
      }
      //清除校验
      if (imgArr.length && ref) {
        this.$refs[form].clearValidate(ref)
      }
      this[change] = true
    },
    //删除图片
    removeImg(file, id, ref) {
      let imgArr = this[id],
        i = '';
      for (let y in imgArr) {
        if (imgArr[y].url == file.url) {
          i = y;
          break
        }
      }
      imgArr.splice(i, 1)
      this.form[ref] = ''
    },
    //删除图片
    removeImg1(file) {
      this.removeImg(file, 'imgArr1', 'img1')
    },
    //浏览图片
    lookImg(file) {
      this.alertImg = file.url;
      this.alertShow = true;
    },
    //上传
    upload1() {
      let that = this,
        urlimgs = [],
        imgArr = this.imgArr1;
      if (that.imgUp1) {
        //新上传判断
        let imgi = 0;
        uploadImg()

        function uploadImg() {
          let raw = imgArr[imgi].raw
          if (raw) {
            loading()
            var form = new FormData();
            form.append("file", raw);
            form.append("filename", new Date().getTime() + '');
            api.uploadPic(form).then(res => {
              urlimgs.push(res.data);
              imgi++;
              if (imgi == imgArr.length) {
                that.imgStr1 = res.data;
                that.submit()
              } else {
                uploadImg()
              }
            }).catch(err => {
              toast(err)
            })
          } else {
            //已上传
            urlimgs.push(imgArr[imgi].url)
            imgi++;
            if (imgi == imgArr.length) {
              that.imgStr1 = urlimgs[0];
              that.submit()
            } else {
              uploadImg()
            }
          }
        }
      } else {
        this.submit()
      }
    },
    //提交
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let param = {
            headPic: this.imgStr1
          }
          console.log(param)
          loading()
          api.editUserInfo(param).then(res => {
            toast("提交成功");
            setTimeout(() => {
              this.getUserInfo()
            }, 2000)
          }).catch(err => {
            toast(err)
          })
        }
      })
    },
  }
})