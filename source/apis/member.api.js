/****使用方法，下面两句复制到page的js文件的头部
		
import { ApiConfig } from '../../apis/apiconfig';
import { MemberApi } from '../../apis/member.api';

var memberApi=new MemberApi();
        *******/
import {
  ApiConfig
} from 'apiconfig';
export class MemberApi {
  //获取用户的信息
  getuserinfo(json, callback, showLoading = true) {

    if (showLoading)
      ApiConfig.ShowLoading();

    var header = ApiConfig.GetHeader();
    console.log(header);
    wx.request({
      url: ApiConfig.GetApiUrl() + 'member/getuserinfo',
      data: json,
      method: 'POST',
      dataType: 'json',
      header: header,
      success: function(res) {
        if (callback != null) {
          callback(res.data);
        }
      },
      fail: function(res) {
        console.log(res);
        callback(false);
      },
      complete: function(res) {
        console.log(res);

        if (showLoading)
          ApiConfig.CloseLoading();
      }
    })
  }

  //获取用户个人详情，也是判断是否登录的依据之一
  info(json, callback, showLoading = true) {

    if (showLoading)
      ApiConfig.ShowLoading();

    var header = ApiConfig.GetHeader();
    console.log(header);
    wx.request({
      url: ApiConfig.GetApiUrl() + 'member/info',
      data: json,
      method: 'POST',
      dataType: 'json',
      header: header,
      success: function(res) {
        if (callback != null) {
          callback(res.data);
        }
      },
      fail: function(res) {
        console.log(res);
        callback(false);
      },
      complete: function(res) {
        console.log(res);

        if (showLoading)
          ApiConfig.CloseLoading();
      }
    })
  }

  //更新用户的个人信息
  infoupdate(json, callback, showLoading = true) {

    if (showLoading)
      ApiConfig.ShowLoading();

    var header = ApiConfig.GetHeader();
    console.log(header);
    wx.request({
      url: ApiConfig.GetApiUrl() + 'member/infoupdate',
      data: json,
      method: 'POST',
      dataType: 'json',
      header: header,
      success: function(res) {
        if (callback != null) {
          callback(res.data);
        }
      },
      fail: function(res) {
        console.log(res);
        callback(false);
      },
      complete: function(res) {
        console.log(res);

        if (showLoading)
          ApiConfig.CloseLoading();
      }
    })
  }

  //更新用户信息
  update(json, callback, showLoading = true) {

    if (showLoading)
      ApiConfig.ShowLoading();

    var header = ApiConfig.GetHeader();
    console.log(header);
    wx.request({
      url: ApiConfig.GetApiUrl() + 'member/update',
      data: json,
      method: 'POST',
      dataType: 'json',
      header: header,
      success: function(res) {
        if (callback != null) {
          callback(res.data);
        }
      },
      fail: function(res) {
        console.log(res);
        callback(false);
      },
      complete: function(res) {
        console.log(res);

        if (showLoading)
          ApiConfig.CloseLoading();
      }
    })
  }

  //更新个人的地理位置
  updatelocation(json, callback, showLoading = true) {

    if (showLoading)
      ApiConfig.ShowLoading();

    var header = ApiConfig.GetHeader();
    console.log(header);
    wx.request({
      url: ApiConfig.GetApiUrl() + 'member/updatelocation',
      data: json,
      method: 'POST',
      dataType: 'json',
      header: header,
      success: function(res) {
        if (callback != null) {
          callback(res.data);
        }
      },
      fail: function(res) {
        console.log(res);
        callback(false);
      },
      complete: function(res) {
        console.log(res);

        if (showLoading)
          ApiConfig.CloseLoading();
      }
    })
  }


  //更新个人的地理位置
  updatemobile(json, callback, showLoading = true) {

    if (showLoading)
      ApiConfig.ShowLoading();

    var header = ApiConfig.GetHeader();
    console.log(header);
    wx.request({
      url: ApiConfig.GetApiUrl() + 'member/updatemobile',
      data: json,
      method: 'POST',
      dataType: 'json',
      header: header,
      success: function(res) {
        if (callback != null) {
          callback(res.data);
        }
      },
      fail: function(res) {
        console.log(res);
        callback(false);
      },
      complete: function(res) {
        console.log(res);

        if (showLoading)
          ApiConfig.CloseLoading();
      }
    })
  }

}