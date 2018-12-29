// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import {
  ShopApi
} from "../../apis/shop.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({list:[]});
  }
  onMyShow() {
    var that = this;
    var shopapi=new ShopApi();
    shopapi.orderlist({},(list)=>{
      for(var i=0;i<list.length;i++){
        list[i].amount = parseFloat(list[i].amount);
        list[i].expressfee = parseFloat(list[i].expressfee);
      }
      this.Base.setMyData({list});
    });
  }
  gotoMenu(){
    wx.switchTab({
      url: '/pages/menu/menu',
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.gotoMenu = content.gotoMenu;
Page(body)