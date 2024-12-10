// ==UserScript==
// @name                解除超星考试复制粘贴限制
// @description         破解题目无法复制,填空题、简答题无法粘贴；破解F12无限Debugger
// @namespace           http://tampermonkey.net/
// @author              hj01857655
// @version             3.0
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11
// @include             *.chaoxing.com/exam-ans/exam/test/reVersionPaperMarkContentNew
// @include             *.chaoxing.com/exam-ans/*
// @connect             chaoxing.com
// @grant               unsafeWindow
// @grant               GM_xmlhttpRequest
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_setClipboard
// @license             MIT
// ==/UserScript==
/* globals  $ */

(function () {
    'use strict';
    let _self = unsafeWindow,
        url = location.pathname,
        top = _self;
    //打印当前路径
    console.log(location.pathname)
    /*
        创建了一个隐藏的 <iframe> 元素，并将其添加到文档的 <body> 中。
        它将 window.console 对象指向这个 <iframe> 的 contentWindow.console，
        所有的日志输出都会被重定向到这个 <iframe> 中
    */
    function enableConsoleLog() {
        function createIframe() {
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.head.appendChild(iframe);
            console.log(iframe.contentWindow.console)
            return iframe.contentWindow.console;
        }

        window.console = createIframe();
    }

    // 100 毫秒检查一次

    window.onerror = () => { return true }
    $(function () {
        enableConsoleLog();
        $.toast({ type: 'success', content: "解除控制台打印成功" });
        setTimeout(() => {
            $("body").removeAttr("onselectstart");
            $("html").css("user-select", "unset");
            Object.entries(UE.instants).forEach(item => {
                item[1].options.disablePasteImage = false;
                item[1].removeListener('beforepaste', editorPaste)
                item[1].removeListener('ready', function () {
                    $(this.document.body).on('focus', arguments[0]);
                })
            });
            $(".sub_que_div").css("pointer-events", "auto");
        },
            1000);
    })
})()
