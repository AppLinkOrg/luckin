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
    //this.needauth=false;
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.indexbanner({}, (indexbanner) => {
      this.Base.setMyData({
        indexbanner
      });
    });
  }
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: '钱包',
    });
  }
  bindlucky() {
    var that = this;
    this.Base.toast('请前往云易创餐饮APP钱包操作');
  }
  bindmoney() {
    wx.navigateTo({
      url: '/pages/money/money',
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindlucky = content.bindlucky;
body.bindmoney = content.bindmoney;
Page(body)