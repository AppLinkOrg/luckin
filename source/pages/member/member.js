// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
  }
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: '我的',
    });
  }
  bindyue() {
    wx.navigateTo({
      url: '/pages/yue/yue',
    })
  }
  bindpurse() {
    wx.navigateTo({
      url: '/pages/purse/purse',
    })
  }
  bindgeren() {
    wx.navigateTo({
      url: '/pages/edit/edit',
    })
  }
  bindfapiao() {
    wx.navigateTo({
      url: '/pages/fapiao/fapiao',
    })
  }
  bindduihuan() {
    wx.navigateTo({
      url: '/pages/duihuan/duihuan',
    })
  }
  bindlipin(){
    wx.navigateTo({
      url: '/pages/lipincode/lipincode',
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindgeren = content.bindgeren;
body.bindyue = content.bindyue;
body.bindpurse = content.bindpurse;
body.bindfapiao = content.bindfapiao;
body.bindduihuan = content.bindduihuan;
body.bindlipin = content.bindlipin;
Page(body)