(function() {
	if (document.cookie.indexOf("UID") < 0) {
		return;
	}
	var requestAjax = function(settings) {
		if (!settings || !settings.url) {
			return;
		}
		var url = settings.url;
		if (!settings.data) {
			data = {};
		}
		var cbName = ("jsonp" + Math.random()).replace(".", "");
		var oScript = document.createElement("script");
		window[cbName] = function(json) {
			oScript.parentNode.removeChild(oScript);
			if (settings.success) {
				settings.success(json);
			}
		};
		data.jsoncallback = cbName;
		data.t = new Date().getTime();
		var arr = [];
		for (var attr in data) {
			arr.push(attr + "=" + data[attr]);
		}
		if (url.indexOf("?") > 0) {
			url += "&" + arr.join("&");
		} else {
			url += "?" + arr.join("&");
		}
		oScript.src = url;
		oScript.setAttribute("defer", "defer");
		if (settings.charset) {
			oScript.setAttribute("charset", settings.charset);
		}
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(oScript);
	};
	var fn = function() {
		var refer = encodeURIComponent($refer);
		requestAjax({
			url: window.location.protocol + "//" + $host + '/api/monitor?version=' + -1 + '&refer=' + refer + '&from=' + '',
			success: function(json) {
				var myjson = eval("(" + json + ")");
				var from = '';
				if (myjson.status == false) {
					if (from == 'exam') {
						console.log(json);
						callback_exam(myjson);
						console.log(json);
					} else {
						var mes = myjson.mes;
						location.href = window.location.protocol + "//" + $host + '/api/monitor_temp?refer=' + refer + '&from=' + '' + "&mes=" + decodeURIComponent(mes);
					}
				}
			}
		});
	};
})();
