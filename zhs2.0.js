// ==UserScript==
// @name                智慧树
// @namespace           coder_tq
// @version             3.2.7
// @description         自动挂机看知到MOOC，支持屏蔽弹窗题目、自动切换下一节，章测试和考试支持自动答题，视频自动倍速播放、线路选择、默认静音等，解除各类功能限制，开放自定义参数
// @author              coder_tq
// @match               *://*.zhihuishu.com/*
// @connect             cx.icodef.com
// @run-at              document-end
// @grant               unsafeWindow
// @grant               GM_xmlhttpRequest
// @grant               GM_setClipboard
// @grant               GM_setValue
// @grant               GM_getValue
// @license             MIT
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 5E3 == 5000，科学记数法，表示毫秒数
    time: 3E3 // 默认响应速度为5秒，不建议小于3秒
    , token: 'gsYmimOpGMCIOtEM' // token可以增加并发次数，用来打码，采集题库奖励

    // 1代表开启，0代表关闭
    , video: 1 // 视频支持课程、见面课，默认开启
    , work: 1 // 自动答题功能，支持章测试、考试，高准确率，默认开启
    , jump: 1 // 自动切换视频，支持课程、见面课，默认开启

    // 仅开启video时，修改此处才会生效
    , line: '高清' // 视频播放的默认线路，可选参数：['高清', '流畅', '校内']，默认'流畅'
    , vol: '0' // 默认音量的百分数，设定范围：[0,100]，'0'为静音，默认'0'
    , speed: '1.5' // 进度统计速率，高倍率可以快速完成任务点，设定范围：(0,+∞)，默认'1.5'倍
    // 上方参数支持在页面改动，下方参数仅支持代码处修改
    , que: 1 // 屏蔽视频时间点对应的节试题，取消屏蔽则自动切换为模拟点击关闭弹题，默认开启
    , danmu: 0 // 见面课弹幕，关闭后在网页中无法手动开启，默认关闭
    , habit: '0' // 限制视频挂机时长，单位是分钟，如需挂机习惯分，可以修改参数为'30'，默认不限制

    // 仅开启work时，修改此处才会生效
    , none: 0 // 无匹配答案时执行默认操作，默认关闭
    , hide: 0 // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭

},
    _self = unsafeWindow,
    url = location.pathname,
    $ = _self.jQuery,
    xhr = _self.XMLHttpRequest,
    vjs = _self.vjsComponent;

console.log(url)
setting.queue = setting.curs = [];
// 脚本守护
window.onload = () => {
    const empty = () => {
    };

    const study2 = document.querySelector(".video-study").__vue__;
    study2.checkout = empty;
    study2.notTrustScript = empty;
    study2.checkoutNotTrustScript = empty;
    const _videoClick = study2.videoClick;
    study2.videoClick = function (...args) {
        args[args.length - 1] = { isTrusted: true };
        return _videoClick.apply(study2, args);
    };

    let old = Element.prototype.attachShadow
    Element.prototype.attachShadow = function (...args) {
        args[0].mode = 'open'
        return old.call(this, ...args)
    }
    let oldoriginFunction = window.originFunction
    window.originFunction = {
        FunctionToString: oldoriginFunction.FunctionToString,
        RegExpTest: oldoriginFunction.RegExpTest,
        AttachShadow: Element.prototype.attachShadow,
    }
}
if (!$) {
    1
} else if (url == '/onlinestuh5') {
    1
} else if (url === '/stuStudy') {
    setting.video && hookVideo(1);
    setting.que && setInterval(() => { doTest() }, 2E3);
    setting.jump && setInterval(() => { checkToNext() }, 1E3);
    var t = setInterval(() => {
        if ($('.iconfont.iconguanbi').length) {
            $('.iconfont.iconguanbi')[0].click();
        }
        if ($('.video, .lessonItem').not(':has(.time_icofinish)').eq(0)) {
            $('.video, .lessonItem').not(':has(.time_icofinish)').eq(0).click();
            clearInterval(t)
        }
    }, 5000)
    if (document.querySelector(".video-study").__vue__) {
        const study2 = document.querySelector(".video-study").__vue__;
        const _initVideo = study2.initVideo;
        study2.initVideo = function (...args) {
            console.log(...args)
            _initVideo.apply(study2, ...args)
        }
    }






} else if (location.href.includes('dohomework')||location.href.includes('doexamination')) {
    let $subject_describe, str;
    setTimeout(function () {
        if ($('.subject_describe>div>div').length) {
            Swal.fire({
                icon: 'success',
                title: '字体加载成功！',
                text: str,
                showConfirmButton: false,
                timer: 200
            })
            $subject_describe = $('.subject_describe>div>div')
            console.log($subject_describe.length)
            $subject_describe.click(function () {
                str = this.shadowRoot.innerHTML.replace('？', '').replace(/<[^>]+>/g, '').replace(' ', '').replace('&nbsp', '').replace(/（/, '').replace(/）/, '')
                GM_setClipboard(str)
                Swal.fire({
                    icon: 'success',
                    title: '复制成功',
                    text: str,
                    showConfirmButton: false,
                    timer: 100
                })
            })
        } else {
            Swal.fire({
                icon: 'error',
                text: '请刷新后再试！',
                showConfirmButton: false,
                timer: 1000
            })
            setTimeout(location.reload(), 1000)

        }

    }, 2000)

} else if (url == '/stuonline/teachMeeting/stuListV2') {
    setTimeout(function () {
        Array.from($('.videogreen_ico').parent().parent()).forEach(function (item, index) {
            console.log(index, item)
            window.open($(item).attr('replaycourseurl'))
        })
    }, 2000)

} else if (url.match('/live/vod_room.html')) {
    setInterval(hookvodroom(1))

}
function hookVideo(tip) {
    _self.PlayerUtil.debugMode = true;
    _self.vjsComponent = function () {
        console.log(arguments)
        var config = arguments[0],
            options = config.options;
        options.volume = 0;
        options.autostart = true;
        options.rate = '1.5';
        tip && config.callback.playbackRate(options.rate);
        vjs.apply(this, arguments);

        config.player.on('loadstart', function () {
            this.loop(true);
            this.play();
            $('.speedBox span').text('X ' + options.rate);
        });
    };
    if (tip != 1) return;
    _self.XMLHttpRequest = setting.que ? function () {
        var ajax = new xhr(),
            open = ajax.open;
        ajax.open = function (url, method) {
            if (url.match('/loadVideoPointerInfo')) {
                method = 'OPTIONS';
            }
            return open.apply(this, arguments);
        };
        return ajax;
    } : xhr;

}

function doTest() {
    if (_self.PlayerStarter.playerArray[0] && _self.PlayerStarter.playerArray[0].player.pause()) {
        _self.PlayerStarter.playerArray[0].player.play();
    }
    if (!$('.dialog-test').length) {
        1
    } else if (setting.queue.length) {
        $(setting.queue.shift()).parent().click();
    } else if (!$('.answer').length) {
        $('.topic-item').eq(0).click();
        if ($('.title-tit').text().indexOf('多选题')) {
            $('.topic-item').eq(1).click();
            $('.topic-item').eq(2).click();
        }
    } else if (!$('.right').length) {
        var tip = $('.answer span').text().match(/[A-Z]/g) || [];
        if (tip.length == 1) return $('.topic-option-item:contains(' + tip[0] + ')').click();
        $('.topic-option-item').each(function () {
            $.inArray($(this).text().slice(0, 1), tip) < 0 == $(this).hasClass('active') && setting.queue.push(this);
        });
    } else if ($('.btn-next:enabled').length) {
        $('.btn-next:enabled').click();
    } else {
        $('.dialog-test .btn').click() && document.querySelector("#playTopic-dialog > div > div.el-dialog__header > button > i").click();
        _self.PlayerStarter.playerArray[0].player.play();
    }

}

function checkToNext() {
    var $tip = $('.video, .lessonItem');
    if ($('.current_play .time_icofinish').length) {//指向正在播放的视频下一个
        $tip.slice($tip.index($('.current_play')) + 1).not(':has(.time_icofinish)').eq(0).click();
    }
}
function hookvodroom(tip) {
    _self.PlayerUtil.debugMode = true;
    _self.vjsComponent = function () {
        console.log(arguments)
        console.log(arguments[0].player)
        var config = arguments[0],
            options = config.options,
            defOptions=config.defOptions;
        options.debugMode=true;
        options.volume = 0;

        options.autostart = true;
        options.rate = '5';
        defOptions.autostart=true,

        vjs.apply(this, arguments);

        config.player.on('loadstart', function () {
            this.loop(true);
            this.play();
            $('.speedBox span').text('X ' + options.rate);
        });
    }
}
