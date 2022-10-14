unsafeWindow.appendChild = unsafeWindow.Element.prototype.appendChild;
        unsafeWindow.Element.prototype.appendChild = function () {
            try {
                if (arguments[0].src.indexOf('detect.chaoxing.com') != -1) {
                    return;
                }
            } catch (e) { }
            unsafeWindow.appendChild.apply(this, arguments);
        };
        unsafeWindow.aalert = unsafeWindow.alert;
    unsafeWindow.alert = (msg) => {
        if (msg == '保存成功') {
            return;
        }
        aalert(msg);
    }
    
