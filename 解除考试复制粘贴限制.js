// ==UserScript==
// @name                破解超星章节测验、作业、考试复制粘贴
// @description         破解简答题无法粘贴；破解F12无限Debugger；增加超星双击题目自动隐式复制题目内容。更新于【2022年5月11号下午】
// @namespace           http://tampermonkey.net/
// @author              hj01857655
// @version             2.0
// @connect             *
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11
// @match               *://*.chaoxing.com/mycourse/studentstudy*
// @match               *://*.chaoxing.com/knowledge/cards*
// @match               *://*.chaoxing.com/ananas/modules/video/index.html
// @match               *://*.chaoxing.com/ananas/modules/work/index.html*
// @match               *://*.chaoxing.com/work/doHomeWorkNew*
// @match               *://*.chaoxing.com/mooc2/work/dowork*
// @match               *://*.chaoxing.com/exam/test/reVersionTestStartNew*
// @match               *://*.chaoxing.com/mooc2/exam/preview*

// @grant               unsafeWindow
// @grant               GM_xmlhttpRequest
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_setClipboard
// @license             MIT
// ==/UserScript==
/* globals  $ */

let _self = unsafeWindow,
    url = location.pathname,
    top = _self;
console.log(location.href)


unsafeWindow.appendChild = unsafeWindow.Element.prototype.appendChild;
unsafeWindow.Element.prototype.appendChild = function () {
    try {
        if (arguments[0].src.indexOf('detect.chaoxing.com') > 0) {
            return;
        }
    } catch (e) { }
    unsafeWindow.appendChild.apply(this, arguments);
};

var scripts = $(document.getElementsByTagName('script'))
for (let i = 0, l = scripts.length; i < l; i++) {
    if (scripts[i].src == 'https://detect.chaoxing.com/api/passport2-onlineinfo.js?key=true&refer=http://i.mooc.chaoxing.com' || scripts[i].src.indexOf('detect.chaoxing.com') != -1) {
        scripts[i].src = '';
        scripts[i].remove();
    }
}
// if (!!location.pathname.match('/mycourse/studentstudy')) {
//     _self.appendChild = _self.Element.prototype.appendChild;
//     _self.Element.prototype.appendChild = function () {
//         try {
//             if (arguments[0].src.indexOf('detect.chaoxing.com') > 0) {
//                 return;
//             }
//         } catch (e) { }
//         _self.appendChild.apply(this, arguments);
//     };



// }


//考试、作业
if (['/exam/test/reVersionTestStartNew', '/mooc2/exam/preview', '/mooc2/work/dowork'].includes(location.pathname)) {
    //1. 更改超星不可粘贴为可粘贴
    setInterval(relieve(), 1000)
    $.toast({ type: 'success', content: '已解除复制、粘贴限制！', time: 1000 });
    //2. 添加双击题目隐式自动复制题目到粘贴板
    let problems = $(".mark_name")
    for (let i = 0; i < problems.length; i++) {
        $node = $(problems[i])
        //alert(str)
        $node.click(function () {
            str = $(this).text().replace($(this).children("span").text(), "")
            str = str.substr(str.indexOf(".") + 2)
            GM_setClipboard(str)
        })
    }
} else if (['/work/doHomeWorkNew'].includes(url)) {//章节测试
    setInterval(function () {
        relieve();
        unsafeWindow.aalert = unsafeWindow.alert;
        unsafeWindow.alert = (msg) => {
            if (msg == '保存成功') {
                return;
            }
            aalert(msg);
        }
    }, 10000)
    let problems = $('.TiMu')
    for (let i = 0; i < problems.length; i++) {
        $node = $(problems[i]).children('div.Zy_TItle.clearfix').children('div.clearfix')
        $node.attr("style", "cursor:hand")
        $node.click(function () {
            _self.noSubmit();
            try {
                str = $(this).text().replace(/^【.*?】\s*/, '').replace(/。$/, '').replace('？', '').replace(/\s*（\d+\.\d+分）$/, '').replaceAll('javascript:void(0);', '').replaceAll("&nbsp;", '').replaceAll("，", ',').replaceAll(
                    "。", '.').replaceAll("：", ':').replaceAll("；",
                        ';').replaceAll("？", '?').replaceAll("（", '(').replaceAll("）", ')').replaceAll("“", '"')
                    .replaceAll("”", '"').replaceAll("！", '!').replaceAll("-", ' ').replace(/(<([^>]+)>)/ig, '')
                    .replace(/^\s+/ig, '').replace(/\s+$/ig, '')

                GM_setClipboard(str)

            } catch (e) {
            }
        })
    }


}

function relieve() {
    for (let ins in UE.instants) {
        // UE.instants[ins].removeListener('beforepaste', editorPaste);//过时了
        UE.instants[ins].removeListener('beforepaste', myEditor_paste);
    }



}

