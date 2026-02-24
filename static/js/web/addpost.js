let app = new Vue({
  el: '#app',
  data: {
    webName,
    info: {
      headPic: '',
      phone: '',
      regTime: '',
      status: 0
    },
    typeArr: [{
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
        label: '长期有效',
        value: '0'
      },
      {
        label: '一周',
        value: '1'
      },
      {
        label: '一个月',
        value: '2'
      },
      {
        label: '两个月',
        value: '3'
      },
      {
        label: '一年',
        value: '4'
      }
    ],
    imgArr1: [],
    imgStr1: [],
    form: {
      id: getParams('id') || 0,
      type: getParams('type') || '',
      endDate: '0',
      title: '',
      img1: '',
      content: '',
      name: '',
      tel: '',
    },
    // 表单校验
    rules: {
      type: [{
        required: true,
        message: "请选择所属分类",
        trigger: "change"
      }],
      endDate: [{
        required: true,
        message: "请选择有效期",
        trigger: "change"
      }],
      title: [{
        required: true,
        message: "请输入信息标题",
        trigger: "blur"
      }],
      content: [{
        required: true,
        message: "请输入内容详情",
        trigger: "blur"
      }],
      img1: [{
        required: true,
        message: "请上传图片",
        trigger: 'change'
      }],
      name: [{
        required: true,
        message: "请输入联系人姓名",
        trigger: "blur"
      }],
      tel: [{
          required: true,
          message: "请输入联系人手机号码",
          trigger: "blur"
        },
        {
          min: 11,
          max: 11,
          message: '手机号码格式不对',
          trigger: "blur"
        },
        {
          pattern: /^[1][0-9][0-9]{9}$/,
          message: '请输入正确的手机号码',
          trigger: "blur"
        }
      ]
    },
    alertImg: '',
    alertShow: false,
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
      this.getDetail()
      this.getUserInfo()
    },
    setTitle() {
      document.title = `${!this.form.id?'发布主题':'编辑主题'}-${webName.title}`
    },
    // 获取详情
    getDetail() {
      let id = this.form.id
      if (!id) {
        return
      }
      let param = {
        topicId: id
      }
      loading()
      api.getPostInfo(param).then(res => {
        loadhide()
        this.isShow = true
        let {
          contactName,
          contactPhone,
          content,
          effectiveTime,
          imageUrl,
          title,
          type
        } = res.data || {}
        let img = imageUrl ? imageUrl.split(',') : []
        this.form.type = type + ''
        this.form.endDate = effectiveTime + '' || '0'
        this.form.title = title
        this.form.img1 = img
        if (content) {
          this.form.content = content.replace(/&nbsp;/g, ' ')
        }
        this.form.name = contactName
        this.form.tel = contactPhone
        const imgArr1 = []
        for (let i = 0; i < img.length; i++) {
          imgArr1.push({
            name: '1',
            url: img[i]
          })
        }
        this.imgArr1 = imgArr1
        this.imgStr1 = imgArr1
      }).catch(err => {
        toast(err)
        setTimeout(() => {
          location.replace('./index.html')
        }, 2000)
      })
    },
    //获取用户信息
    getUserInfo() {
      api.getUserInfo().then(res => {
        const {
          headPic,
          phone,
          registryTime,
          idCard,
          realName
        } = res.data || {}
        this.info = {
          headPic: headPic,
          phone: phone,
          regTime: registryTime,
          status: realName && idCard ? 1 : 0
        }
        this.checkCard()
      })
    },
    //身份证校验
    checkCard() {
      let {
        status
      } = this.info
      if (!status) {
        layer.confirm('当前账号未实名认证，发布主题必须填写认证信息！', {
          title: "提示",
          btn: ['确定'],
          icon: false
        }, () => {
          layer.closeAll()
          location.href = `./mycertify.html`
        }, (index) => {});
      }
    },
    logOut() {
      layer.confirm('确定要退出登录吗？', {
        title: "提示",
        btn: ['确定', '取消']
      }, () => {
        layer.closeAll()
        //返回首页
        quitLogin(1)
      }, (index) => {});
    },
    //输入数字
    setNumber(val) {
      val = val.replace(/[^\d]/g, '')
      this.form.tel = val
    },
    //读取本地图片
    changeImg1(file, list) {
      this.changeImg(file, list, this, 4096, 'imgArr1', 'img1', 'form')
    },
    //限制图片大小,//读取本地图片,每次1张回调
    changeImg(file, list, that, size, id, ref, form) {
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
      // 处理图片数组
      let img = []
      for (let y in imgArr) {
        img.push(imgArr[y].url)
      }
      this.form[ref] = img.length ? img : ''
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
    maxImg() {
      toast("最多上传4张图片");
    },
    //上传
    upload1() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let that = this,
            urlimgs = [],
            imgArr = this.imgArr1;
          if (imgArr.length) {
            //新上传
            let imgi = 0;
            uploadImg()

            function uploadImg() {
              let raw = imgArr[imgi].raw
              if (raw) {
                let form = new FormData();
                form.append("file", raw);
                form.append("filename", new Date().getTime() + '');
                api.uploadImg(form).then(res => {
                  urlimgs.push(res.data);
                  imgi++;
                  if (imgi == imgArr.length) {
                    that.imgStr1 = urlimgs;
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
                  that.imgStr1 = urlimgs;
                  that.submit()
                } else {
                  uploadImg()
                }
              }
            }
          } else {
            this.submit()
          }

        }
      })
    },
    //提交
    submit() {
      let {
        id,
        type,
        endDate,
        title,
        img1,
        content,
        name,
        tel,
      } = this.form
      console.log(this.form)
      let {
        imgArr1,
        imgStr1
      } = this
      console.log(imgArr1, imgStr1)
      let param = {
        id,
        contactName: name,
        contactPhone: tel,
        content,
        effectiveTime: Number(endDate),
        imageUrl: imgStr1.join(','),
        title,
        type
      }
      console.log(param)
      loading()
      if (id) {
        api.editPost(param).then(res => {
          toast("主题编辑成功");
          setTimeout(() => {
            location.href = `./information.html?id=${id}`
          }, 2000)
        }).catch(err => {
          toast(err)
        })

      } else {
        api.addPost(param).then(res => {
          toast("主题发布成功");
          setTimeout(() => {
            location.href = `./mypost.html`
          }, 2000)
        }).catch(err => {
          toast(err)
        })
      }
    },
  }
})