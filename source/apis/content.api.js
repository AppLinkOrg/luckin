
        /****使用方法，下面两句复制到page的js文件的头部
		
import { ApiConfig } from '../../apis/apiconfig';
import { ContentApi } from '../../apis/content.api';

var contentApi=new ContentApi();
        *******/
import { ApiConfig } from 'apiconfig';
export class ContentApi
{
			//获取页面文字内容
				get(json, callback, showLoading = true) {

					if (showLoading)
					ApiConfig.ShowLoading();
    
					var header=ApiConfig.GetHeader();
					console.log(header);
					wx.request({
					  url: ApiConfig.GetApiUrl() + 'content/get',
					  data: json,
					  method: 'POST',
					  dataType: 'json',
					  header: header,
					  success: function (res) {
						if (callback != null) {
						  callback(res.data);
						}
					  },
					  fail: function (res) {
						console.log(res);
						callback(false);
					  },
					  complete: function (res) {
						console.log(res);

						if (showLoading)
						ApiConfig.CloseLoading();
					  }
					})
				  }
                

}

