// ==UserScript==
// @name                破解超星章节测验、作业、考试复制粘贴
// @description         破解简答题无法粘贴；破解F12无限Debugger；增加超星双击题目自动隐式复制题目内容。更新于【2022年5月11号下午】
// @namespace           http://tampermonkey.net/
// @author              hj01857655
// @version             2.0
// @connect             *
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11
// @match               *://*.chaoxing.com/knowledge/cards*
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
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11
// ==/UserScript==


let _self = unsafeWindow,
    url = location.pathname,
    top = _self
console.log(url)
!function () {
    // 3.增加破解无限Debugger
    var constructorHook = constructor;
    Function.prototype.constructor = function (s) {
        if (s == "debugger") {
            return function () { }
        }
        return constructorHook(s);
    }
}
//考试、作业
if (['/exam/test/reVersionTestStartNew', '/mooc2/exam/preview', '/mooc2/work/dowork'].includes(location.pathname)) {
    //1. 更改超星不可粘贴为可粘贴
    setInterval(relieve(), 100)
    $.toast({ type: 'success', content: '已解除复制、粘贴限制！', time: 1000 });
    //2. 添加双击题目隐式自动复制题目到粘贴板
    let problems = $(".mark_name")
    for (let i = 0; i < problems.length; i++) {
        $node = $(problems[i])
        //alert(str)
        $node.click(function () {
            str = $(this).text().replace($(this).children("span").text(), "")
            str = str.substr(str.indexOf(".") + 2)
            $.toast({ type: 'success', content: '复制成功', time: 1000 });
            GM_setClipboard(str)
        })
    }
} else if (['/work/doHomeWorkNew'].includes(url)) {//章节测试
    setInterval(relieve(), 100)
    console.log(UE.instants)
    let problems = $('.TiMu')
    for (let i = 0; i < problems.length; i++) {
        $node = $(problems[i]).children('div.Zy_TItle.clearfix').children('div.clearfix')
        $node.attr("style", "cursor:hand")
        $node.click(function () {
            try {
                console.log(this)
                //console.log($(this).children('div.Zy_TItle.clearfix').children('div.clearfix').text().replace(/^【.*?】\s*/, '').replace(/。$/, '').replace('？', ''))
                //str = $(this).children('div.Zy_TItle.clearfix').children('div.clearfix').text().replace(/^【.*?】\s*/, '').replace(/。$/, '').replace('？', '')
                str = $(this).text().replace(/^【.*?】\s*/, '').replace(/。$/, '').replace('？', '').replace(/\s*（\d+\.\d+分）$/, '')
                // str = $(this).children('div.Zy_TItle.clearfix').children('div.clearfix.font-cxsecret').text().replace(/^【.*?】\s*/, '').replace(/。$/, '').replace('？', '')
                //str=repttf($(this).children('div.Zy_TItle.clearfix').children('div.clearfix.font-cxsecret').text()).replace(/^【.*?】\s*/, '').replace(/。$/, '').replace('？','')
                GM_setClipboard(str)

                Swal.fire({
                    icon: 'success',
                    title: '复制成功',
                    text: str,
                    showConfirmButton: false,
                    timer: 200
                })
                _self.noSubmit();
            } catch (e) {
                _self.noSubmit();
                Swal.fire({
                    icon: 'success',
                    title: 'error',
                    text: e,
                    showConfirmButton: false,
                    timer: 200
                })
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

