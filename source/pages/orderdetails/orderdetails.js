// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import {
  ShopApi
} from "../../apis/shop.api.js";
import {
  WechatApi
} from "../../apis/wechat.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    //options = {  shop_id: "2", menu_id: "2", orderids: "8" };
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ totalprice: 0, expresstype: "A", eat:1});
  }
  onMyShow() {
    var that = this;
    var shopapi=new ShopApi();
    shopapi.shopinfo({id:this.Base.options.shop_id},(shop)=>{

    
    
      var ziti_time =new Date( (new Date()).getTime() + parseInt(shop.ziti_minute) * 60 * 1000);
      var songhuo_time = new Date( (new Date()).getTime() + parseInt(shop.songhuo_minute) * 60 * 1000);

      shop.ziti = ziti_time.getHours() + ":" + ziti_time.getMinutes();
      shop.songhuo = songhuo_time.getHours() + ":" + songhuo_time.getMinutes();

      this.Base.setMyData({ shop });
      //GetDistance
    });
    this.setCurrent();

    var address_id = this.Base.getMyData().address_id;
    var memberinfo = this.Base.getMyData().memberinfo;
    if(address_id==undefined){
      this.Base.setMyData({ address_id: memberinfo.defaultaddress})
      address_id = memberinfo.defaultaddress;
    }
    var shopapi = new ShopApi();
    shopapi.addressinfo({id:address_id},(info)=>{
      this.Base.setMyData({addressinfo:info});
    });
    

  }

  changeExpress(){
    var expresstype=this.Base.getMyData().expresstype;
    expresstype = expresstype== "A" ? "B" : "A";
    this.Base.setMyData({  expresstype });
  }

  dataReturnCallback(callid, data) {
    this.Base.setMyData({ address_id: data });
  }

  selecteat(e){

    this.Base.setMyData({ eat:e.currentTarget.id });
  }

  setCurrent() {
    var shopapi = new ShopApi();

    shopapi.menugoods({
      menu_id: this.Base.options.menu_id
    }, (menugoods) => {
      this.Base.setMyData({
        menugoods
      });
      var shopapi = new ShopApi();
      shopapi.cartlist({ orderids: this.Base.options.orderids}, (orderitem) => {
        this.Base.setMyData({ orderitem});
        this.calc();
      });
    });
  }
  calc() {
    var orderitem = this.Base.getMyData().orderitem;
    var menugoods = this.Base.getMyData().menugoods;
    var totalprice = 0;
    var totalnum = 0;
    var cansales = [];
    for (var i = 0; i < orderitem.length; i++) {
      var vallist = orderitem[i].vallist;
      var price = parseFloat(orderitem[i].goods_price);
      var valstr = [];
      for (var a of vallist) {
        valstr.push(a.sname);
        price += parseFloat(a.price);
      }
      totalnum += parseInt(orderitem[i].num);
      orderitem[i].valstr = valstr.join("/");
      orderitem[i].oneprice = price;

      for (var a of menugoods) {
        if (a.goods_id == orderitem[i].goods_id) {
          var price = orderitem[i].oneprice;
          console.log(a.discount);
          if (a.discount > 0) {
            console.log("jkk");
            orderitem[i].oldprice = orderitem[i].oneprice;
            orderitem[i].oneprice = parseFloat((orderitem[i].oneprice * parseFloat(a.discount / 10.0)).toFixed(2));
            orderitem[i].havediscount = "Y";
          }
          break;
        }

      }
      orderitem[i].numprice = orderitem[i].oneprice * parseInt(orderitem[i].num);
      
      totalprice += orderitem[i].numprice;

    }
    


    this.Base.setMyData({
      orderitem,
      totalprice
    });
  }
  payment(e){

    var api = new WechatApi();
    var data=this.Base.options;
    var sdata=this.Base.getMyData();
    data.eat = sdata.eat;
    data.expresstype = sdata.expresstype;
    data.address_id = sdata.address_id;
    
    console.log(data);
    console.log(sdata);
    if(data.expresstype=="B"){
      if (data.address_id == 0){
        this.Base.info("请选择送货地址");
        return;
      }else{
        var meter = this.Base.util.GetDistance(sdata.shop.lat, sdata.shop.lng, sdata.addressinfo.lat, sdata.addressinfo.lng);
        console.log(meter);
        if (meter > parseInt(sdata.shop.deliverymeter)){
          this.Base.info("送货地址超出了范围");
          return;
        }
      }
    }
    
    

    api.prepay(data, (ret)=>{
      console.log(ret);
      ret.complete = function (e) {
        wx.switchTab({
          url: '/pages/orderlist/orderlist',
        })
      }
      wx.requestPayment(ret);
    });


  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.calc = content.calc; 
body.setCurrent = content.setCurrent;
body.payment = content.payment;
body.changeExpress = content.changeExpress;
body.selecteat = content.selecteat;
Page(body)