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
import {
  ShopApi
} from "../../apis/shop.api.js";
import {
  ApiUtil
} from "../../apis/apiutil.js";


class Content extends AppBase {
  constructor() {

    super();
  }
  onLoad(options) {
    this.Base.needauth = false;
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);

    
  }
  brandtap(e) {
    //console.log(currentTarget);
    var id = e.currentTarget.id;
    console.log(id);
    this.Base.setMyData({ s: id })
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
        }
        this.setCurrent();
      });
    });
  }
  setCurrent() {
    var shop_id = AppBase.SHOPID;
    var shoplist = this.Base.getMyData().shoplist;
    for (var i = 0; i < shoplist.length; i++) {
      if (shoplist[i].id == shop_id) {
        this.Base.setMyData({ currentshop: shoplist[i] });


        
       var is=ApiUtil.checkInOpen(this.Base.getMyData().currentshop.openning);
   
       


        var shopapi = new ShopApi();
        shopapi.menucat({ menu_id: shoplist[i].menu_id }, (menucat) => {
          shopapi.menugoods({ menu_id: shoplist[i].menu_id }, (menugoods) => {
            var ret=[];
            var loc=0;
            for(var i=0;i<menucat.length;i++){
              menucat[i].goods=[];
              for (var j = 0; j < menugoods.length; j++) {
                if(menucat[i].id==menugoods[j].cat_id){
                  menucat[i].goods.push(menugoods[j]);
                }
              }
              if(menucat[i].goods.length>0){
                menucat[i].scrollstart = loc;
                menucat[i].scrollend = loc + 37 + 110 * menucat[i].goods.length;
                loc = loc + 37 + 110 * menucat[i].goods.length;
                ret.push(menucat[i]);
              }
            }
            this.Base.setMyData({ menu: ret, selectcat_id:ret[0].id});
          });
        });
        return;
      }
    }
  }
  goodsscroll(e) {
    console.log(e);
    console.log(e.detail);

    var isgoto = this.Base.getMyData().isgoto;
    if(isgoto==true){
      this.Base.setMyData({   isgoto: false });
    }else{
      var top = e.detail.scrollTop;
      var menu = this.Base.getMyData().menu;
      var selectcat_id = this.Base.getMyData().selectcat_id;
      var cat_id = 0;
      for (var item of menu) {
        if (item.scrollstart <= top && top < item.scrollend) {
          cat_id = item.id;
          break;
        }
      }
      if (selectcat_id != cat_id) {
        this.Base.setMyData({ selectcat_id: cat_id });
        
      }
    }
  }
  gotoCat(e){
    var id=e.currentTarget.id;
    this.Base.setMyData({ "intocat_id": "cat_" + id, selectcat_id: id,isgoto:true});
  }
  selectgoods(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/goods/goods?id='+id,
    })
  }

  dataReturnCallback(data) {

  }
  chooseShop(){
    wx.navigateTo({
      url: '/pages/shopchoose/shopchoose',
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.setCurrent = content.setCurrent; 
body.goodsscroll = content.goodsscroll; 
body.gotoCat = content.gotoCat; 
body.selectgoods = content.selectgoods;
body.chooseShop = content.chooseShop;
Page(body)