// ==UserScript==
// @name         解除考试复制粘贴限制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可粘贴、可复制
// @author       wangdi
// @match        https://mooc1.chaoxing.com/mooc2/work/dowork*
// @match        https://mooc1.chaoxing.com/exam/*
// @match        https://mooc1.chaoxing.com/mooc2/exam/preview*
// @grant        none
// @license      MIT License
// ==/UserScript==

(function() {
    'use strict';

    let editorList=document.getElementsByTagName('textarea');//解除考试和作业不能粘贴
    for(let i=0;i<editorList.length;i++){
        let id=editorList[i].getAttribute('name');
        var editor1 = UE.getEditor(id);
        editor1.removeListener('beforepaste', editorPaste);
    }
    document.querySelector("body").setAttribute('onselectstart',"return true");//解除考试时不能复制
    document.getElementsByTagName('html')[0].style.userSelect='text'

})();
