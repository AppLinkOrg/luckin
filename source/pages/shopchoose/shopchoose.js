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
    this.Base.setMyData({
      tab: 0
    });
    super.onLoad(options);
    this.Base.setMyData({ SHOPID: AppBase.SHOPID});
  }
  onMyShow() {
    var that = this;
    this.Base.getAddress((location) => {
      console.log(location);
      var mylat = location.location.lat;
      var mylng = location.location.lng;
      this.Base.setMyData({
        mylocation: location.ad_info
      });
      var shopapi = new ShopApi();
      shopapi.shoplist({
        mylat,
        mylng
      }, (shoplist) => {
        for (var i = 0; i < shoplist.length; i++) {
          shoplist[i].mile = this.Base.util.GetDistance(mylat, mylng, shoplist[i].lat, shoplist[i].lng);

          shoplist[i].miletxt = this.Base.util.GetMileTxt(shoplist[i].mile);
        }
        this.Base.setMyData({ shoplist }); 
        if (AppBase.SHOPID == 0) {
          AppBase.SHOPID = shoplist[0].id;
          this.Base.setMyData({ SHOPID: AppBase.SHOPID });
        }
      });
    });
    var shopapi = new ShopApi();
    shopapi.cartlist({}, (cartorder) => {
      this.Base.setMyData({ cartorder });
    });
  }

  changetab(e) {
    this.Base.setMyData({
      tab: e.currentTarget.id
    });
  }
  chooseShop(e){
    var id=e.currentTarget.id;
    AppBase.SHOPID = id;
    wx.navigateBack({
      
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.changetab = content.changetab;
body.chooseShop = content.chooseShop;
Page(body)