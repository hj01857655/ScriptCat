// ==UserScript==
// @name         百度题库默认展示答案和解析
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.3
// @description  省去手动点击
// @author       You
// @match        https://easylearn.baidu.com/edu-page/tiangong/*
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        let searchButton = document.querySelector('.more-text')
        // 存在我们就点击
        if (searchButton) {
            searchButton.click()
            setTimeout(() => {
                if(document.querySelector('.question-recomm')){
                    document.querySelector('.dan-btn').click();
                }
            }, 1000)
        }
    }, 2000)
})();
