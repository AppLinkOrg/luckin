// pages/addressselect/addressselect.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    
    super.onLoad(options);
    this.Base.setMyData({
      inputShowed: false,
      inputVal: ""
    });
  }
  onMyShow() {
    var that = this;
    var that = this;
    this.Base.getAddress((location) => {
      console.log(location);
      that.Base.setMyData({ inputVal: location.address, inputShowed:true});
      that.search();
    });
  }

  showInput() {
    this.Base.setMyData({
      inputShowed: true
    });
  }
  hideInput() {
    this.Base.setMyData({
      inputVal: "",
      inputShowed: false, searchresult: []
    });
    this.search();
  }
  clearInput() {
    this.Base.setMyData({
      inputVal: "", searchresult: []
    });

    this.search();
  }
  inputTyping(e) {
    this.Base.setMyData({
      inputVal: e.detail.value
    });
    this.search();
  }
  search() {
    var that = this;
    var data = this.Base.getMyData();
    console.log(data);
    var inputVal = this.Base.getMyData().inputVal;
    var routesearcharea = this.Base.getMyData().instinfo.routesearcharea;
    if (routesearcharea == "") {
      routesearcharea = "深圳市";
    }
    routesearcharea = "深圳市";
    console.log(inputVal);
    QQMAP.getSuggestion({
      keyword: inputVal,
      region: routesearcharea,
      region_fix: 1,
      //policy:1,
      success: function (res) {
        console.log(res);

        var items = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type == 0) {
            items.push(res.data[i]);
          }
        }
        res.data = items;
        that.Base.setMyData({
          items: res.data
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });


  }
  searchKeyword(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      inputVal: val, inputShowed: true
    });
    this.search();
  }

  locationSelect(idx) {
    console.log("laasdasd");
    idx = idx.currentTarget.id;
    var items = this.Base.getMyData().items;
    var item = items[idx];
    console.log(item);

    this.dataReturn(item);
  }


}

var QQMapWX = require('../../libs/qqmap/qqmap-wx-jssdk.js');
var QQMAP = new QQMapWX({
  key: 'IDVBZ-TSAKD-TXG43-H442I-74KVK-6LFF5'
});

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.showInput = content.showInput;
body.hideInput = content.hideInput;
body.clearInput = content.clearInput;
body.inputTyping = content.inputTyping;
body.search = content.search;
body.searchKeyword = content.searchKeyword;
body.locationSelect = content.locationSelect;
Page(body)