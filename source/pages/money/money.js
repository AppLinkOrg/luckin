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
      title: '充值餐饮钱包',
    });
  }

  bindjian(){
    var num = this.Base.getMyData().num;
    if (num > 1) {
      num--;
      this.Base.setMyData({
        num
      });
    }
  }
  bindadd(){
    var num = this.Base.getMyData().num;
    if (num < 99) {
      num++;
      this.Base.setMyData({
        num
      });
    }
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindjian = content.bindjian;
body.bindadd = content.bindadd;
Page(body)