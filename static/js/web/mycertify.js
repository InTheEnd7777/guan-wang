const watchIdcard = (rule, value, callback) => {
  if (!app.checkParity(app.form.idCard)) {
    callback(new Error("身份证号码格式不正确"));
  } else {
    callback();
  }
};

// 检测中文
const isChn = (rule, value, callback) => {
  var reg = new RegExp("^[\u4e00-\u9fa5]+$");
  if (!reg.test(value)) {
    callback(new Error("姓名只能输入中文"));
  } else {
    callback();
  }
}

let app = new Vue({
  el: '#app',
  data: {
    form: {
      status: 0, //0未实名 1已实名
      name: '',
      idCard: '',
      img1: '',
      img2: '',
    },
    alertImg: '',
    alertShow: false,
    imgArr1: [],
    imgStr1: [],
    imgUp1: false,
    imgArr2: [],
    imgStr2: [],
    imgUp2: false,
    rules: {
      name: [{
          required: true,
          message: "请输入真实姓名",
          trigger: "blur"
        },
        {
          required: true,
          validator: isChn,
          trigger: "blur"
        }
      ],
      idCard: [{
          required: true,
          message: "请输入身份证号码",
          trigger: "blur"
        },
        {
          required: true,
          validator: watchIdcard,
          trigger: "blur"
        }
      ],
      // img1: [{
      //   required: true,
      //   message: "请上传证件照人像面",
      //   trigger: ['change']
      // }],
      // img2: [{
      //   required: true,
      //   message: "请上传证件照国徽面",
      //   trigger: ['change']
      // }],
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
      setHead('身份认证')
    },
    //获取用户信息
    getUserInfo() {
      api.getUserInfo().then(res => {
        const {
          status,
          realName,
          idCard,
          picHead,
          picBack
        } = res.data || {}
        this.form = {
          status: idCard && realName,
          name: realName,
          idCard: idCard,
          img1: picHead || '',
          img2: picBack || ''
        }
        this.imgArr1 = [{
          name: '1',
          url: picHead
        }]
        this.imgStr1 = this.imgArr1
        this.imgArr2 = [{
          name: '2',
          url: picBack
        }]
        this.imgStr2 = this.imgArr2
        //上传状态清除
        this.imgUp1 = false
        this.imgUp2 = false
      })
    },
    //身份证号校验
    checkParity(card) {
      //15位转18位,基本无15位
      card = this.change15To18(card)
      var len = card.length
      if (len == '18') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2')
        var cardTemp = 0,
          i,
          valnum
        for (i = 0; i < 17; i++) {
          cardTemp += card.substr(i, 1) * arrInt[i]
        }
        valnum = arrCh[cardTemp % 11]
        if (valnum == card.substr(17, 1)) {
          return true
        }
        return false
      }
      return false
    },
    //15位转18位身份证号
    change15To18(card) {
      if (card.length == '15') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2')
        var cardTemp = 0,
          i
        card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6)
        for (i = 0; i < 17; i++) {
          cardTemp += card.substr(i, 1) * arrInt[i]
        }
        card += arrCh[cardTemp % 11]
        return card
      }
      return card
    },
    //读取本地图片
    changeImg1(file, list) {
      this.changeImg(file, list, this, 4096, 'imgArr1', 'img1', 'form', 'imgUp1')
    }, //读取本地图片
    changeImg2(file, list) {
      this.changeImg(file, list, this, 4096, 'imgArr2', 'img2', 'form', 'imgUp2')
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
    //删除图片
    removeImg2(file) {
      this.removeImg(file, 'imgArr2', 'img2')
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
        console.log(123, '新上传')
        let imgi = 0;
        uploadImg()

        function uploadImg() {
          let raw = imgArr[imgi].raw
          if (raw) { //新上传判断
            that.$modal.loading()
            let fd = new FormData();
            fd.append("media", raw);
            that.$axios({
              url: that.upurl,
              data: fd,
              success: res => {
                if (res.code == 200) {
                  urlimgs.push(res.data.url); //图片不带前缀
                  imgi++;
                  if (imgi == imgArr.length) {
                    that.imgStr1 = urlimgs;
                    that.upload2()
                  } else {
                    uploadImg()
                  }
                }
              }
            })
          } else { //已上传
            urlimgs.push(imgArr[imgi].url)
            imgi++;
            if (imgi == imgArr.length) {
              that.imgStr1 = urlimgs;
              that.upload2()
            } else {
              uploadImg()
            }
          }
        }
      } else {
        this.upload2()
      }
    }, //上传
    upload2() {
      let that = this,
        urlimgs = [],
        imgArr = this.imgArr2;
      if (that.imgUp2) {
        console.log(123, '新上传')
        let imgi = 0;
        uploadImg()

        function uploadImg() {
          let raw = imgArr[imgi].raw
          if (raw) { //新上传判断
            that.$modal.loading()
            let fd = new FormData();
            fd.append("media", raw);
            that.$axios({
              url: that.upurl,
              data: fd,
              success: res => {
                if (res.code == 200) {
                  urlimgs.push(res.data.url);
                  imgi++;
                  if (imgi == imgArr.length) {
                    that.imgStr2 = urlimgs;
                    that.submit()
                  } else {
                    uploadImg()
                  }
                }
              }
            })
          } else { //已上传
            urlimgs.push(imgArr[imgi].url.replace(that.lsUrl2, ''))
            imgi++;
            if (imgi == imgArr.length) {
              that.imgStr2 = urlimgs;
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
        // if (valid) {
          let {
            name,
            idCard,
            img1,
            img2
          } = this.form
          let param = {
            realName: name,
            idCard: idCard,
            // picHead: img1[0].url,
            // picBack: img2[0].url
          }
          loading()
          //判断伍佳仪421182200208174129
          if (name == "伍佳仪" && idCard != "421182200208174129") {
            toast("实名认证失败");
            return
          }
          api.editUserInfo(param).then(res => {
            toast("提交成功");
            setTimeout(() => {
              this.getUserInfo()
            }, 2000)
          }).catch(err => {
            toast(err)
          })
        // }
      })
    },
  }
})