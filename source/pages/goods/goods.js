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

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id = 1;
    this.Base.needauth = true;
    super.onLoad(options);
    this.Base.setMyData({ num:1});
  }
  onMyShow() {
    var that = this;
    var shopapi = new ShopApi();
    shopapi.goodsinfo({
      id: this.Base.options.id
    }, (info) => {
      this.Base.setMyData(info);
      this.loadprice();
    });
  }
  loadprice() {
    var data = this.Base.getMyData();
    var price = parseFloat(data.price);
    console.log(price);

    var pricemsg = data.name + "¥" + data.price;
    var vals = [];

    var attrs = this.Base.getMyData().attrs;
    for (var i = 0; i < attrs.length; i++) {
      for (var j = 0; j < attrs[i].vals.length; j++) {
        if (attrs[i].vals[j].selected=="Y"){
          if (attrs[i].isshow=='Y'){
            pricemsg += "+" + attrs[i].vals[j].sname + "¥" + attrs[i].vals[j].price;
          }
          vals.push(parseInt(attrs[i].vals[j].id));
          price = price + parseFloat(attrs[i].vals[j].price);
        }
      }
    }
    vals.sort();
    this.Base.setMyData({ pricemsg, totalprice: price, vals: vals.join(",")});
  }
  selectval(e) {
    var id = e.currentTarget.id;
    id = id.split("_");
    var attr_id = id[0];
    var val_id = id[1];

    var attrs = this.Base.getMyData().attrs;
    for (var i = 0; i < attrs.length; i++) {
      if (attr_id == attrs[i].id) {
        for (var j = 0; j < attrs[i].vals.length; j++) {
          var s = attrs[i].vals[j].id == val_id ? "Y" : "N";
          attrs[i].vals[j].selected = s;
          console.log(attrs[i].vals[j].selected);
        }
      }
    }
    console.log(attrs[0].vals[0].selected);
    this.Base.setMyData({
      attrs
    });
    this.loadprice();
  }
  jian(){
    var num=this.Base.getMyData().num;
    if(num>1){
      num--;
      this.Base.setMyData({ num });
    }
  }
  jia() {
    var num = this.Base.getMyData().num;
    if (num < 99) {
      num++;
      this.Base.setMyData({ num });
    }
  }
  addToCart() {
    var data = this.Base.getMyData();
    var shopapi = new ShopApi();
    shopapi.addtocart({
      goods_id: data.id,
      vals:data.vals,
      num:data.num
    }, (ret) => {
      console.log(ret);
      wx.navigateBack({
        
      })
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.jia = content.jia;
body.jian = content.jian;
body.selectval = content.selectval; 
body.loadprice = content.loadprice; 
body.addToCart = content.addToCart;
body.chooseShop = content.chooseShop;
Page(body)