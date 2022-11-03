// ==UserScript==
// @name                撤销处理
// @namespace           https://bbs.tampermonkey.net.cn/
// @version             0.1.0
// @description         try to take over the world!
// @author              You
// @grant               unsafeWindow
// @grant               GM_addStyle
// @grant               GM_xmlhttpRequest
// @connect             *
// @match               https://stat2-ans.chaoxing.com/study-unusual-monitor/*
// @match               https://stat2-ans.chaoxing.com/keeper/study-monitor/*
// ==/UserScript==


// 撤销处理
alert = console.log
if (document.location.pathname == '/study-unusual-monitor/unnormalanalysis') {
    setInterval(function () {
        let revoke = document.getElementsByClassName("revoke-btn");

        let nusual = document.getElementsByClassName("del-nusual");
        if (revoke.length != 0) {
            console.log(revoke);
            let revokes = Array.from(revoke);
            revokes.forEach(function (item) {
                item.click();
                document.getElementById("revokeConfirmBtn").click();
            })
        } else {
            if (nusual.length != 0) {
                console.log(nusual);
                let nusuals = Array.from(nusual);
                nusuals.forEach(function (item) {
                    item.click();
                    document.getElementById("delUnnormalConfirm").click();

                })

            } else {
                alert('暂无需要标为正常的');
                
            }
        }
        if(revoke.length==0&&nusual.length==0){
            setTimeout(window.close())
        }
    }, 2000)

} else if (location.pathname == '/keeper/study-monitor/unnormal') {
    $('a:contains(40条/页)').click();
    $('.l_filter')[0].addEventListener('click', function () {
        let studentName = $('#studentName').val();
        console.log(studentName)
        GM_xmlhttpRequest({
            method: 'get',
            url: 'https://stat2-ans.chaoxing.com/keeper/study-monitor/unnormalList?fid=2207&pageNo=1&pageSize=40&teacherName=&studentName=' + encodeURIComponent(studentName) + '&courseName=&courseSemester=-1&dealType=-1&unnormalType=-1&group1=0&group2=0&group3=0&schoolid=2207&senc=551b689d3a7076dfb709ce5b9e505aa4dbfe670d869ab893641594086cf836c4&exportType=0',
            onload: function (res) {
                unnormal = Array.from(JSON.parse(res.responseText).data);
                unnormal.forEach(function (item) {
                    if (item['teacherName'] == '2022年暑假') {
                        console.log(item)
                        var courseId = item.courseId;
                        var clazzId = item.clazzId;
                        var cpi = item.cpi;
                        var personId = item.personId;
                        var enc = item.enc;
                        var userId = item.curId;
                        var url = 'https://stat2-ans.chaoxing.com/study-unusual-monitor/unnormalanalysis?courseid=' + courseId + '&clazzid=' + clazzId + '&cpi=' + cpi + '&stucpi=' + personId + '&enc=' + enc + '&ut=t' +
                            '&uid=' + userId;
                        window.open(url);
                    }
                })


            }
        })
    })



}








