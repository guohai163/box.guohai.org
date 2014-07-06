/*
*项　目　名：光宇音乐盒
*版　　本　：0.3.1
*作　　者　：H! Guo
*创建时间　：2009-07-10
*最后修改时间：2009-07-10
*/
/********************网页数据界面层********************/
GyyxMusicBoxWeb.ToDayRecom = Class.create();
GyyxMusicBoxWeb.ToDayRecom.prototype = {
    initialize: function() {//初始化
        this.html = ""; //临时HTML

    },
    UpdateHeaderSpecial: function(code, div) {
        var url = "GetToDayRecom.php?keyWord=special&signValue=" + code + "&time=" + new Date().getTime();
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: function(transport) {
                var myDocument = new ActiveXObject("Microsoft.XMLDOM");
                myDocument.loadXML(transport.responseText);
                var myRoot = myDocument.documentElement;
                var dir = myRoot.getElementsByTagName("specialinfo");
                if (dir != null && dir.length > 0) {
                    var strHtml = "<ul class=\"sblist\">";
                    for (var i = 0; i < dir.length; i++) {
                        var imgurl = dir[i].getAttribute('imgUrl').length == 0 ? "Images/noimg.jpg" : dir[i].getAttribute('imgUrl');
                        var spName = dir[i].getAttribute('spName').length > 10 ? dir[i].getAttribute('spName').substring(0, 9) : dir[i].getAttribute('spName');
                        strHtml += "<li><p class=\"timg\"><a href=\"javascript:void(null);\" onclick=\"webui.BindCentenMenu('S" + dir[i].getAttribute('spName') + "',-1,23);\"><img width=\"75\" height=\"75\" src=\"" + imgurl + "?" + new Date().getTime() + "\" alt=\"\" /></a></p><p class=\"tit\">" + spName + "</p><p><a href=\"javascript:void(null);\"  onclick=\"webui.BindCentenMenu('S" + dir[i].getAttribute('chanName') + "',-1,22);\">" + dir[i].getAttribute('chanName') + "</a></p><p>" + dir[i].getAttribute('createDate') + "</p><p><a href=\"javascript:void(null);\" class=\"addSingle\" onclick=\"webui.BindCentenMenu('S" + dir[i].getAttribute('spName') + "',-1,23);playMusicList.AddSystemMusicListToUserList();webui.WebTop2UI(1);\"></a></p></li>";
                    }
                    strHtml += "</ul>";
                    div.innerHTML = strHtml;
                }
            } .bind(this)
        });
    },
    UpdateHeaderMenu: function(code) {//更新头部的菜单，code头部ID号

        var hmenu = $('hmenu1', 'hmenu2', 'hmenu3', 'hmenu4');
        var special = $('special1', 'special2', 'special3', 'special4');
        for (var i = 1; i <= hmenu.length; i++) {
            hmenu[i - 1].className = i == code ? "on" : "";
            if (code == i && special[i - 1].innerHTML.length <= 0) this.UpdateHeaderSpecial(code, special[i - 1]);
            special[i - 1].style.display = i == code ? "" : "none";
        }
    },
    UpdateBodyMusic: function(code, div) {
        var url = "GetToDayRecom.php?keyWord=music&signValue=" + code + "&time=" + new Date().getTime();
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: function(transport) {
                var myDocument = new ActiveXObject("Microsoft.XMLDOM");
                myDocument.loadXML(transport.responseText);
                var myRoot = myDocument.documentElement;
                var dir = myRoot.getElementsByTagName("item");
                if (dir != null && dir.length > 0) {
                    var strHtml = "<ul class=\"slist\">";
                    for (var i = 0; i < dir.length; i++) {
                        strHtml += "<li><span class=\"name\"><a href=\"javascript:void(null);\" onclick=\"playMusicList.AddMusicToNowPlayList(0,'" + dir[i].getAttribute('file') + "','" + dir[i].getAttribute('lrc') + "','" + dir[i].getAttribute('title') + "','" + dir[i].getAttribute('singer') + "','" + dir[i].getAttribute('album') + "'," + dir[i].getAttribute('popularity') + "," + dir[i].getAttribute('serverid') + ");\" >" + dir[i].getAttribute('title') + "</a></span><span class=\"author\"><a href=\"javascript:void(null);\" onclick=\"webui.BindCentenMenu('S" + dir[i].getAttribute('singer') + "',-1,22);\">" + dir[i].getAttribute('singer') + "</a></span><span class=\"opm\"><a href=\"javascript:void(null);\" onclick=\"playMusicList.AddMusicToNowPlayList(0,'" + dir[i].getAttribute('file') + "','" + dir[i].getAttribute('lrc') + "','" + dir[i].getAttribute('title') + "','" + dir[i].getAttribute('singer') + "','" + dir[i].getAttribute('album') + "'," + dir[i].getAttribute('popularity') + "," + dir[i].getAttribute('serverid') + ");\" ><img src=\"images/tj_19.gif\" alt=\"\" /></a></span></li>";
                    }
                    strHtml += "</ul>";
                    div.innerHTML = strHtml;
                }
            } .bind(this)
        });
    },
    UpdateBodyMenu: function(code, menu, mdiv) {
        var bmenu = $(menu + '1', menu + '2');
        var bmusic = $(mdiv + '1', mdiv + '2');
        var x = code % 2;
        if (x == 1) {
            bmenu[0].className = "on";
            bmenu[1].className = "";
            if (bmusic[0].innerHTML.length <= 0) this.UpdateBodyMusic(code, bmusic[0]);
            bmusic[0].style.display = "";
            bmusic[1].style.display = "none";
        }
        else {
            bmenu[0].className = "";
            bmenu[1].className = "on";
            if (bmusic[1].innerHTML.length <= 0) this.UpdateBodyMusic(code, bmusic[1]);
            bmusic[0].style.display = "none";
            bmusic[1].style.display = "";
        }
    },
    AddAllMusicToList: function(code, menu) {
        var bmenu = $(menu + '1', menu + '2');
        if (bmenu[0].className == "on") {
            code = code * 2 + 1;
        }
        else {
            code = code * 2 + 2;
        }
        var url = "GetToDayRecom.php?keyWord=music&signValue=" + code + "&time=" + new Date().getTime();
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: function(transport) {
                var myDocument = new ActiveXObject("Microsoft.XMLDOM");
                myDocument.loadXML(transport.responseText);
                var myRoot = myDocument.documentElement;
                var dir = myRoot.getElementsByTagName("item");
                if (dir != null && dir.length > 0) {
                    for (var i = 0; i < dir.length; i++) {
                        playMusicList.AddMusicToNowPlayList(0, dir[i].getAttribute('file'), dir[i].getAttribute('lrc'), dir[i].getAttribute('title'), dir[i].getAttribute('singer'), dir[i].getAttribute('album'), dir[i].getAttribute('popularity'), dir[i].getAttribute('serverid'));
                    }
                    div.innerHTML = strHtml;
                }
            } .bind(this)
        });
    }
};

var objTDR = new GyyxMusicBoxWeb.ToDayRecom();
