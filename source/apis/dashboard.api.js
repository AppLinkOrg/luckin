
        /****使用方法，下面两句复制到page的js文件的头部
		
import { ApiConfig } from '../../apis/apiconfig';
import { DashboardApi } from '../../apis/dashboard.api';

var dashboardApi=new DashboardApi();
        *******/
import { ApiConfig } from 'apiconfig';
export class DashboardApi
{
			//启用此接口，设置主控台的概览数据，根据本例子来设置主控台数据
				summary(json, callback, showLoading = true) {

					if (showLoading)
					ApiConfig.ShowLoading();
    
					var header=ApiConfig.GetHeader();
					console.log(header);
					wx.request({
					  url: ApiConfig.GetApiUrl() + 'dashboard/summary',
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

