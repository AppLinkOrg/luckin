// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ShopApi } from "../../apis/shop.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.needauth=true;
    this.Base.setMyData({list:[]});
  }
  onMyShow() {
    var that = this;
    var api=new ShopApi();
    api.addresslist({},(list)=>{
      this.Base.setMyData({list});
    });
  }
  gotoEdit(e){
    wx.navigateTo({
      url: '/pages/address/address?id='+e.currentTarget.id,
    })
  }
  selectaddress(e) {
    if(this.Base.options.needreturn=="Y"){
      this.dataReturn(e.currentTarget.id);
    } 
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.gotoEdit = content.gotoEdit;
body.selectaddress = content.selectaddress;
Page(body)