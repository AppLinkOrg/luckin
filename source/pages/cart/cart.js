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
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      num: 1,
      xuanzhon: 1,
      totalprice: 0,
      expresstype:"A"
    });
  }
  jian(e) {
    var that=this;
    var ischange = false;
    var id = e.currentTarget.id;
    var cartorder = this.Base.getMyData().cartorder;
    for (var i = 0; i < cartorder.length; i++) {
      if (id == cartorder[i].id) {
        var num = parseInt(cartorder[i].num);
        if (num > 0) {
       
          if (num == 1) {
            
            wx.showModal({
              title: '提示',
              content: '确定要放弃商品吗？',
              success: function (sm) {
                if (sm.confirm) {
                  var shopapi = new ShopApi();
                  shopapi.cartlist({}, (cartorder) => {
                    that.Base.setMyData({
                      cartorder
                    });
                  })
                
                } else if (sm.cancel) {
                 
                  that.jia(e);
                }
              }
            })
            
          }
          num--;
          console.log(888888888);
          cartorder[i].num = num;
          var shopapi = new ShopApi();
          shopapi.updatecartordernum({
            id: cartorder[i].id,
            num
          });
          ischange = true;
        }
      }
    }
    if (ischange) {

      this.Base.setMyData({
        cartorder
      });
      this.calc();
    }
  }
  jia(e) {
    var ischange = false;
    var id = e.currentTarget.id;
    var cartorder = this.Base.getMyData().cartorder;
    for (var i = 0; i < cartorder.length; i++) {
      if (id == cartorder[i].id) {
        var num = parseInt(cartorder[i].num);
        if (num < 99) {
          num++;
          cartorder[i].num = num;
          var shopapi = new ShopApi();
          shopapi.updatecartordernum({
            id: cartorder[i].id,
            num
          });
          ischange = true;
        }
      }
    }
    if (ischange) {

      this.Base.setMyData({
        cartorder
      });
      this.calc();
    }
  }
  changexz(e) {
    var id = e.currentTarget.id;
    console.log(id);
    id = id.split("_");
    var checked = id[1];
    id = id[0];
    console.log(checked);
    var cartorder = this.Base.getMyData().cartorder;
    for (var i = 0; i < cartorder.length; i++) {
      if (id == cartorder[i].id) {
        console.log("a");
        cartorder[i].checked_value = checked;
        var shopapi = new ShopApi();
        shopapi.updatecartorderchecked({
          id: cartorder[i].id,
          checked
        });
      }
    }

    this.Base.setMyData({
      cartorder
    });
    this.calc();
  }

  onMyShow() {
    var lastshop = wx.getStorageSync("lastshop_id");
    if (shop_id == lastshop) {
      console.log("is suppoer return");
      //this.calc();
      return;
    }
    var that = this;
    var shop_id = AppBase.SHOPID;
    this.Base.getAddress((location) => {
      console.log(location);
      var mylat = location.location.lat;
      var mylng = location.location.lng;
      this.Base.setMyData({
        mylocation: location.ad_info
      });

      wx.setStorage({
        key: 'lastshop_id',
        data: shop_id,
      })
      var shopapi = new ShopApi();
      shopapi.shoplist({
        mylat,
        mylng
      }, (shoplist) => {
        for (var i = 0; i < shoplist.length; i++) {
          shoplist[i].mile = this.Base.util.GetDistance(mylat, mylng, shoplist[i].lat, shoplist[i].lng);
          shoplist[i].miletxt = this.Base.util.GetMileTxt(shoplist[i].mile);
        }
        this.Base.setMyData({
          shoplist
        });
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
        this.Base.setMyData({
          currentshop: shoplist[i]
        });
        var is = ApiUtil.checkInOpen(this.Base.getMyData().currentshop.openning);
        this.Base.setMyData({
          is
        });

        var shopapi = new ShopApi();

        shopapi.menugoods({
          menu_id: shoplist[i].menu_id
        }, (menugoods) => {
          this.Base.setMyData({
            menugoods
          });
          this.calc();
        });
        return;
      }
    }
  }
  calc() {
    var shopapi = new ShopApi();
    shopapi.cartlist({}, (cartorder) => {

    var menugoods = this.Base.getMyData().menugoods;
    var totalprice = 0;
    var totalnum = 0;
    var cansales = [];
    for (var i = 0; i < cartorder.length; i++) {
      cartorder[i].cansales = 'N';
      var vallist = cartorder[i].vallist;
      var price = parseFloat(cartorder[i].goods_price);
      var valstr = [];
      for (var a of vallist) {
        valstr.push(a.sname);
        price += parseFloat(a.price);
      }
      totalnum += parseInt(cartorder[i].num);
      cartorder[i].valstr = valstr.join("/");
      cartorder[i].oneprice = price;

      for (var a of menugoods) {
        if (a.goods_id == cartorder[i].goods_id) {
          var price = cartorder[i].oneprice;
          console.log(a.discount);
          if (a.discount > 0) {
            console.log("jkk");
            cartorder[i].oldprice = cartorder[i].oneprice;
            cartorder[i].oneprice = parseFloat((cartorder[i].oneprice * parseFloat(a.discount / 10.0)).toFixed(2));
            cartorder[i].havediscount = "Y";
          }
          cartorder[i].cansales = "Y";
          break;
        }
      }
      cartorder[i].numprice = cartorder[i].oneprice * parseInt(cartorder[i].num);
      if (cartorder[i].checked_value == "Y" && cartorder[i].cansales == "Y"){
        totalprice += cartorder[i].numprice;
      }
    }
    if (totalnum > 0) {

      wx.setTabBarBadge({
        index: 3,
        text: totalnum.toString(),
      })
    } else {
      wx.removeTabBarBadge({
        index: 3
      });
    }


    this.Base.setMyData({
      cartorder,
      totalprice
    });

    });
  }
  chooseShop() {
    wx.navigateTo({
      url: '/pages/shopchoose/shopchoose',
    })
  }
  changeExpressType(e){
    console.log(e);
    this.Base.setMyData({expresstype:e.detail.value?"A":"B"});
  }
  gotoConfirm(e){
    var cartorder = this.Base.getMyData().cartorder; 
    var expresstype = this.Base.getMyData().expresstype;
    var currentshop = this.Base.getMyData().currentshop;
    var ids=[];
    for (var i = 0; i < cartorder.length; i++) {
      if (cartorder[i].cansales == 'Y' && cartorder[i].checked_value == 'Y'){
        ids.push(cartorder[i].id);
      }
    }
    var ids=ids.join(",");
    wx.navigateTo({
      url: '/pages/orderdetails/orderdetails?shop_id=' + AppBase.SHOPID + "&orderids=" + ids + "&menu_id="+currentshop.menu_id,
    })
  }


  gotoMenu() {
    wx.switchTab({
      url: '/pages/menu/menu',
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.jia = content.jia;
body.jian = content.jian;
body.changexz = content.changexz;
body.setCurrent = content.setCurrent;
body.calc = content.calc; 
body.chooseShop = content.chooseShop;
body.changeExpressType = content.changeExpressType; 
body.gotoConfirm = content.gotoConfirm;
body.gotoMenu = content.gotoMenu;
Page(body)