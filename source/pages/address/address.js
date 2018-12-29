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
    this.Base.setMyData({ gender: "M", address: "", label: "1", isdefault:"N"});
  }
  onMyShow() {
    var that = this;
    console.log(this.Base.getMyData().address);
    if (this.Base.options.id != undefined && this.Base.getMyData().address==""){
      var shopapi=new ShopApi();
      shopapi.addressinfo({id:this.Base.options.id},(info)=>{
        info.isdefault = info.isdefault_value;
        this.Base.setMyData(info);
      });
    }
  }
  selectgender(e){

    this.Base.setMyData({ gender: e.currentTarget.id });
  }
  selectlabel(e) {

    this.Base.setMyData({ label: e.currentTarget.id });
  }
  setdefault(e) {

    this.Base.setMyData({ isdefault: e.currentTarget.id });
  }
  search() {
    var that = this;
    wx.navigateTo({
      url: '/pages/addressselect/addressselect',
    });
  }
  dataReturnCallback(callbackid, data) {
    console.log(data);
    this.Base.setMyData({ address: data.address,lat:data.location.lat,lng:data.location.lng });
  }
  save(e){
    console.log(e.detail.value);
    var api = new ShopApi();
    api.addaddress(e.detail.value,(ret)=>{
      if(ret.code=="0"){
        wx.navigateBack({
          
        })
      }else{
        this.Base.info(ret.result);
      }
    });
  }
  remove(e){
    wx.showModal({
      title: '提示',
      content: '是否确定移除本地址？',
      success:(e)=>{
        if(e.confirm){
          var api = new ShopApi();
          api.addressremove({ idlist:this.Base.options.id}, (ret) => {
            if (ret.code == "0") {
              wx.navigateBack({

              })
            } else {
              this.Base.info(ret.result);
            }
          }); 
        }
      }
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.selectgender = content.selectgender;
body.search = content.search;
body.selectlabel = content.selectlabel; 
body.save = content.save; 
body.addaddress = content.addaddress; 
body.setdefault = content.setdefault;
body.remove = content.remove;
Page(body)