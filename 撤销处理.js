// ==UserScript==
// @name         撤销处理与标为正常
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @match        https://stat2-ans.chaoxing.com/stat2/study-unusual-monitor/unnormalanalysis*
// ==/UserScript==

(function () {
    function checkAndClick() {
        // 获取"撤销处理"按钮
        var revokeButtons = $(".revoke-btn");
        // 获取"标为正常"按钮
        var normalButtons = $(".del-nusual");

        if (revokeButtons.length > 0) {
            // 存在"撤销处理"按钮，执行点击操作
            revokeButtons.each(function (index, button) {
                $(button).click();
                setTimeout(function () {
                    $("#revokeConfirmBtn").click();
                }, 200);
            });
        } else if (normalButtons.length > 0) {
            // 如果没有"撤销处理"按钮但有"标为正常"按钮，点击"标为正常"按钮
            normalButtons.each(function (index, button) {
                $(button).click();
                // 在点击"标为正常"按钮后等待一段时间，然后点击"确定"按钮
                setTimeout(function () {
                    $("#delUnnormalConfirm").click();
                }, 200); // 1秒后执行点击"确定"按钮
            });
        }
    }

    // 设置定时器，每5000毫秒（5秒）执行一次检查
    setInterval(checkAndClick, 2000);







    // Your code here...
})();
