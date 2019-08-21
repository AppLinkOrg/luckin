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
      title: '账户余额',
    });
  }
  binddetail() {
    wx.navigateTo({
      url: '/pages/yuedetail/yuedetail',
    })
  }
  
  binderweima(){
  wx.navigateTo({
    url: '/pages/erweima/erweima',
  })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.binddetail = content.binddetail;
body.binderweima = content.binderweima;
Page(body)