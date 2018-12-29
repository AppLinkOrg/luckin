/****
import { MemberApi } from "../apis/member.api";
import { WechatApi } from "../apis/wechat.api";
 */
import {
  ApiConfig
} from "apis/apiconfig.js";
import {
  ApiUtil
} from "apis/apiutil.js";
import {
  InstApi
} from "apis/inst.api.js";
import {
  MemberApi
} from "apis/member.api";
import {
  WechatApi
} from "apis/wechat.api";
import {
  ShopApi
} from "apis/shop.api";

export class AppBase {
  static SHOPID = 0;
  static QQMAPKEY = "IDVBZ-TSAKD-TXG43-H442I-74KVK-6LFF5";
  static UserInfo = {};
  static InstInfo = {};
  unicode = "tmcf";
  needauth = true;
  pagetitle = null;
  app = null;
  options = null;
  data = {
    uploadpath: ApiConfig.GetUploadPath(),
    copyright: {
      name: "",
      website: "mecloud.com"
    },
    cartorder:[]
  };
  Page = null;
  util = ApiUtil;
  constructor() {
    this.app = getApp();
    this.me = this;
    //ApiConfig.SetToken("10e991a4ca7a93c60794628c11edaea3");
  }
  setPageTitle(instinfo) {
    wx.setNavigationBarTitle({
      title: instinfo.name,
    })
  }
  generateBodyJson() {
    var base = this;
    return {
      Base: base,
      /**
       * 页面的初始数据
       */
      data: base.data,
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: base.onLoad,

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: base.onReady,

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: base.onShow,

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: base.onHide,

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: base.onUnload,

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: base.onPullDownRefresh,

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: base.onReachBottom,

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: base.onShareAppMessage,
      onMyShow: base.onMyShow,
      phonenoCallback: base.phonenoCallback,
      viewPhoto: base.viewPhoto,
      phoneCall: base.phoneCall,
      openMap: base.openMap,
      backPage: base.backPage,
      backHome: base.backHome,
      logout: base.logout,
      switchTab: base.switchTab,
      closePage: base.closePage,
      gotoPage: base.gotoPage,
      navtoPage: base.navtoPage,
      openContent: base.openContent,
      getPhoneNo: base.getPhoneNo,
      dataReturn: base.dataReturn,
      dataReturnCallback: base.dataReturnCallback,
      loadtabtype: base.loadtabtype,
      contactkefu: base.contactkefu,
      contactweixin: base.contactweixin,
      download: base.download,
      checkPermission: base.checkPermission



    }
  }
  log() {
    console.log("yeah!");
  }
  onLoad(options) {
    this.Base.options = options;
    console.log(options);
    console.log("onload");
    this.Base.setBasicInfo();
    this.Base.setMyData({
      options: options
    });

    ApiConfig.SetUnicode(this.Base.unicode);
  }
  gotoOpenUserInfoSetting() {
    var that = this;
    wx.showModal({
      title: '需要您授权才能正常使用小程序',
      content: '请点击“去设置”并启用“用户信息”，然后确定即可正常使用',
      confirmText: "去设置",
      success: function(res) {
        if (res.confirm) {
          wx.openSetting({

          })
        } else {
          that.gotoOpenUserInfoSetting();
        }
      }
    })
  }
  setBasicInfo() {
    var that = this;
  }
  onReady() {
    console.log("onReady");
  }
  minimm
  onShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.resources({}, (res) => {
      this.Base.setMyData({
        res
      });
    });

    instapi.info({}, (instinfo) => {
      if (instinfo == null || instinfo == false) {

        return;
      }
      instinfo.expressfreeup = parseInt(instinfo.expressfreeup);
      instinfo.expressfee = parseInt(instinfo.expressfee);
      AppBase.InstInfo = instinfo;
      this.Base.setMyData({
        instinfo: instinfo
      });
      if (this.Base.pagetitle == null) {
        this.Base.setPageTitle(instinfo);
      } else {

      }
    }, false);

    if (AppBase.UserInfo.openid == undefined) {
      // 登录
      console.log("onShow");
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res);
          wx.getUserInfo({
            success: userres => {
              AppBase.UserInfo = userres.userInfo;
              console.log(userres);

              var memberapi = new MemberApi();
              memberapi.getuserinfo({
                code: res.code,
                grant_type: "authorization_code"
              }, data => {
                console.log("here");
                console.log(data);
                AppBase.UserInfo.openid = data.openid;
                AppBase.UserInfo.session_key = data.session_key;
                console.log(AppBase.UserInfo);
                ApiConfig.SetToken(data.openid);
                console.log("goto update info");
                //this.loadtabtype();


                memberapi.update(AppBase.UserInfo, () => {

                  console.log(AppBase.UserInfo);
                  that.Base.setMyData({
                    UserInfo: AppBase.UserInfo
                  });
                  that.checkPermission();

                });

                //that.Base.getAddress();
              });
            },
            fail: res => {
              console.log("auth fail");
              console.log(res);
              //that.Base.gotoOpenUserInfoSetting();
              if (this.Base.needauth == true) {
                wx.navigateTo({
                  url: '/pages/auth/auth',
                })
              } else {
                that.onMyShow();
              }
              //that.getAddress();
            }
          });

        }
      })
      return false;
    } else {
      if (that.setMyData != undefined) {
        that.setMyData({
          UserInfo: AppBase.UserInfo
        });
      } else {
        that.Base.setMyData({
          UserInfo: AppBase.UserInfo
        });
      }
      //this.loadtabtype();

      that.Base.setMyData({
        UserInfo: AppBase.UserInfo
      });

      that.checkPermission();
    }

  }
  loadtabtype() {
    console.log("loadtabtype");
    var memberapi = new MemberApi();
    memberapi.update(AppBase.UserInfo, () => {});
  }
  checkPermission() {
    var memberapi = new MemberApi();
    var that = this;
    memberapi.info({}, (info) => {
      if (info.mobile == "" && this.Base.needauth == true) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        })
      } else {
        this.Base.setMyData({
          memberinfo: info
        });
        
        var shopapi = new ShopApi();
        shopapi.cartlist({}, (cartorder) => {
          //for (var i = 0; i < cartorder.length;i++){
          //  cartorder[i].cansales='Y';
          //}
          //this.Base.setMyData({
          //  cartorder
          //});
          that.onMyShow();
          var totalnum = 0;
          for (var item of cartorder) {
            totalnum += parseInt(item["num"]);
          }
          if (totalnum > 0) {

            wx.setTabBarBadge({
              index: 3,
              text: totalnum.toString(),
            })
          } else {
            wx.removeTabBarBadge({
              index: 3
            });
          }
        });
      }
    });
  }

  onMyShow() {
    console.log("onMyShow");
  }
  onHide() {
    console.log("onHide");
  }
  onUnload() {
    console.log("onUnload");
  }
  onPullDownRefresh() {
    console.log("onPullDownRefresh");
    this.onShow();
    wx.stopPullDownRefresh();
  }
  onReachBottom() {
    console.log("onReachBottom");
  }
  onShareAppMessage() {


  }

  dataReturn(data) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    console.log("????");
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.dataReturnCallback(this.Base.options.callbackid, data);
    wx.navigateBack();
  }

  dataReturnCallback(callbackid, data) {
    console.log("please use dataReturnCallback(callbackid, data)");
  }

  setMyData(obj) {
    console.log(obj);
    this.Page.setData(obj);
  }
  getMyData() {
    return this.Page.data;
  }
  getPhoneNo(e) {
    var that = this;
    console.log(e);
    var api = new WechatApi();
    var data = this.Base.getMyData();
    console.log(data);

    e.detail.session_key = AppBase.session_key;
    e.detail.openid = AppBase.openid;
    console.log(e.detail);
    api.decrypteddata(e.detail, (ret) => {
      console.log(ret);
      that.phonenoCallback(ret.return.phoneNumber, e);
    });
  }
  phonenoCallback(phoneno, e) {
    console.log("phone no callback");
    console.log(phoneno);
    console.log(e);
  }
  viewPhoto(e) {
    var img = e.currentTarget.id;
    console.log(img);
    wx.previewImage({
      urls: [img],
    })
  }
  viewGallary(modul, photos, current = "") {
    var nphotos = [];
    for (var i = 0; i < photos.length; i++) {
      nphotos.push(ApiConfig.GetUploadPath() + modul + "/" + photos[i]);
    }
    current = ApiConfig.GetUploadPath() + modul + "/" + current;
    console.log(nphotos);
    wx.previewImage({
      urls: nphotos,
      current: current
    })
  }
  phoneCall(e) {
    var tel = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
  getAddress(callback, lat, lng) {
    var that = this;
    if (AppBase.QQMAP == null) {
      var QQMapWX = require('libs/qqmap/qqmap-wx-jssdk.js');
      AppBase.QQMAP = new QQMapWX({
        key: AppBase.QQMAPKEY
      });
    }
    console.log("getmyaddress");
    if (lat == undefined && lng == undefined) {
      wx.getLocation({
        success: function(res) {
          lat = res.latitude;
          lng = res.longitude;
          AppBase.QQMAP.reverseGeocoder({
            location: {
              latitude: lat,
              longitude: lng
            },
            success: function(res) {
              //that.setMyData({ addressinfo:res.result });
              callback(res.result);
            },
            fail: function(res) {
              console.log("fail get location");
              callback(res.result);
              console.log(res);
            },
            complete: function(res) {
              console.log("complete");
              console.log(res);
            }
          });
        }
      });
    } else {
      AppBase.QQMAP.reverseGeocoder({
        location: {
          latitude: lat,
          longitude: lng
        },
        success: function(res) {
          console.log("success");
          console.log(res);
          callback(res.result);
        },
        fail: function(res) {
          console.log("fail");
          console.log(res);
        },
        complete: function(res) {
          console.log("complete");
          console.log(res);
        }
      });
    }
  }
  openMap(e) {
    if (AppBase.QQMAP == null) {
      var QQMapWX = require('libs/qqmap/qqmap-wx-jssdk.js');
      AppBase.QQMAP = new QQMapWX({
        key: 'IDVBZ-TSAKD-TXG43-H442I-74KVK-6LFF5'
      });
    }
    var address = e.currentTarget.id;
    AppBase.QQMAP.geocoder({
      address: address,
      success: function(res) {
        if (res.status == 0) {
          var lat = res.result.location.lat;
          var lng = res.result.location.lng;

          wx.openLocation({
            type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
            address: address,
            latitude: lat,
            longitude: lng,
            success: function(res) {

            }
          })
        }
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  }
  uploadFile(modul, filename, callback) {

    var tempFilePaths = filename
    wx.uploadFile({
      url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
      filePath: tempFilePaths,
      name: 'file',
      formData: {
        'module': modul,
        "field": "file"
      },
      success: function(res) {
        console.log(res);
        var data = res.data
        if (data.substr(0, 7) == "success") {
          data = data.split("|");
          var photo = data[2];
          callback(photo);
        } else {
          wx.showToast({
            title: '上传失败，请重试',
            icon: 'warn',
            duration: 2000
          })
        }
        //do something
      }
    });
  }
  uploadImage(modul, callback, count = 1, completecallback) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: count,
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            success: function(res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
        if (completecallback != undefined) {
          completecallback();
        }
      }
    })
  }

  uploadOneImage(modul, callback, completecallback) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 1,
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            success: function(res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
        if (completecallback != undefined) {
          completecallback();
        }
      }
    })
  }

  uploadVideo(modul, callback, completecallback) {
    wx.chooseVideo({
      compressed: true, // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 60,
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = [];
        tempFilePaths.push(res.tempFilePath);
        //res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            success: function(res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
        if (completecallback != undefined) {
          completecallback();
        }
      }
    })
  }

  takeImage(modul, callback) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            success: function(res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
      }
    })
  }


  takeVideo(modul, callback) {
    wx.chooseVideo({
      compressed: false,
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 60,
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = [res.tempFilePath];
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            success: function(res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
      }
    })
  }
  info(message) {
    wx.showModal({
      title: '提示',
      content: message,
      showCancel: false
    })
  }
  warning(message) {
    wx.showModal({
      title: '警告',
      content: message,
      showCancel: false
    })
  }
  error(message) {
    wx.showModal({
      title: '错误',
      content: message,
      showCancel: false
    })
  }

  backPage() {
    wx.navigateBack({

    });
  }
  backHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  }
  logout() {
    wx.redirectTo({
      url: '/pages/signin/signin',
    })
  }
  gotoPage(e) {
    console.log(e);
    var dataset = e.currentTarget.dataset;
    var page = dataset.page;
    var parameter = dataset.param;
    if (parameter != "") {
      parameter = "?" + parameter;
    }
    var url = "../" + page + "/" + page + parameter;
    console.log(url);
    wx.redirectTo({
      url: url,
    })
  }
  navtoPage(e) {
    console.log(e);
    var dataset = e.currentTarget.dataset;
    var page = dataset.page;
    var parameter = dataset.param;
    if (parameter != "") {
      parameter = "?" + parameter;
    }
    var url = "../" + page + "/" + page + parameter;
    console.log(url);
    wx.navigateTo({
      url: url,
    })
  }
  switchTab(e) {
    console.log(e);
    var page = e.currentTarget.id;
    var url = "../" + page + "/" + page;
    console.log(url);
    wx.redirectTo({
      url: url,
    })
  }
  closePage() {

  }
  openContent(e) {
    var title = e.currentTarget.dataset.title;
    var keycode = e.currentTarget.dataset.keycode;
    console.log(title);
    wx.navigateTo({
      url: '/pages/content/content?keycode=' + keycode + "&title=" + title,
    })
  }
  console(key, val) {
    var json = {
      key,
      val
    };
    console.log(json);
  }

  checkRealname(callback) {
    var memberapi = new MemberApi();
    memberapi.checkrealname({}, (ret) => {
      if (ret == false) {
        wx.navigateTo({
          url: '/pages/signup/signup',
        })
      } else {
        callback();
      }
    });
  }

  download(url, callback, open = false) {
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      success: function(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function(res) {
              var savedFilePath = res.savedFilePath;
              if (open == true) {
                wx.openDocument({
                  filePath: savedFilePath,
                });
              }
              console.log(savedFilePath);
              if (callback != null) {
                callback(savedFilePath);
              }
            }
          })
        }
      }
    })
  }

  contactkefu() {
    var instinfo = this.Base.getMyData().instinfo;
    
    console.log(instinfo);
    wx.showActionSheet({
      itemList: ["拨打热线", "添加客服"],
      success(e) {
        if (e.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: instinfo.tel
          })
        } else {
          var img = ApiConfig.GetUploadPath() + "inst/" + instinfo.kefuerweima;
          console.log(img);
          wx.previewImage({
            urls: [img],
          })
        }
      }
    })
  }
  contactweixin() {
    //wechatno
    var instinfo = this.Base.getMyData().instinfo;
    console.log(instinfo);
    wx.showActionSheet({
      itemList: [instinfo.wechatno, "一键复制"],
      success(e) {
        if (e.tapIndex == 0) {

        } else {
          wx.setClipboardData({
            data: instinfo.wechatno,
          })
        }
      }
    })
  }
  toast(msg) {
    wx.showToast({
      title: msg,
      icon: "none"
    })
  }
}