/*
*项　目　名：光宇音乐盒,页面调用盒子功能
*版　　本　：0.0.1
*作　　者　：H! Guo
*创建时间　：2009-07-20
*最后修改时间：2009-07-20
*/
/****************************************/
if (GyyxMusicBoxWeb == undefined) { var GyyxMusicBoxWeb = {}; }

/********************界面层********************/
GyyxMusicBoxWeb.IndexPageUI = Class.create();
GyyxMusicBoxWeb.IndexPageUI.prototype = {
    initialize: function() {//初始化
        this.BindHeaderSpecial();
        this.BindBodySpecial();
        this.BindRightMusicList(13, $('RightMusicList71'));
        this.BindRightMusicList(14, $('RightMusicList72'));
        this.BindRightMusicList(15, $('RightMusicList81'));
        this.BindRightMusicList(16, $('RightMusicList82'));
        this.BindRightMusicList(17, $('RightMusicList91'));
        this.BindRightMusicList(18, $('RightMusicList92'));
        this.BindBottomMusicList(19, $('BottomMusicList10'));
        this.BindBottomMusicList(20, $('BottomMusicList11'));
        this.BindBottomMusicList(21, $('BottomMusicList12'));

//        this.BindWenDaogameRadioList();
//        this.BindXiYouRadioList();
        var xj = new Date().getDay();
        this.BindRadioMenu(xj, 1);
        this.BindRadioMenu(xj, 2);
    },
    BindHeaderSpecial: function() {
        var url = "GetToDayRecom.php?keyWord=special&signValue=1&time=" + new Date().getTime();
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: function(transport) {
                var myDocument = new ActiveXObject("Microsoft.XMLDOM");
                myDocument.loadXML(transport.responseText);
                var myRoot = myDocument.documentElement;
                var dir = myRoot.getElementsByTagName("specialinfo");

                if (dir != null && dir.length > 0) {
                    var strHtml = "<div class=\"gtlft\"><p class=\"plimg\"><a href=\"#\" onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[0].getAttribute('spName') + "',code:'23'}]);return false;\"><img src=\"" + dir[0].getAttribute('imgUrl') + "?" + new Date().getTime() + "\" alt=\"\"/></a></p><p class=\"ptit\">NO.1<span style=\"cursor: pointer;\" onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[0].getAttribute('spName') + "',code:'23'}]);\">" + dir[0].getAttribute('spName') + "</span></p><p class=\"ptxt\"><a href=\"#\"  onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[0].getAttribute('chanName') + "',code:'22'}]);return false;\">" + dir[0].getAttribute('chanName') + "</a></p><p class=\"ptxt\"></p><p class=\"pinfo\">" + dir[0].getAttribute('note') + "</p><p class=\"popk\"><a href=\"#\" class=\"st\"  onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[0].getAttribute('spName') + "',code:'23'}]);return false;\">试听</a></p></div><ul class=\"urtt\">";
                    for (var i = 1; i < 5; i++) {
                        var imgurl = dir[i].getAttribute('imgUrl').length == 0 ? "Images/noimg.jpg" : dir[i].getAttribute('imgUrl');
                        var spName = dir[i].getAttribute('spName').length > 10 ? dir[i].getAttribute('spName').substring(0, 9) : dir[i].getAttribute('spName');
                        strHtml += "<li><p class=\"tit\">" + (i + 1) + "<a href=\"#\" class=\"name\"  onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[i].getAttribute('spName') + "',code:'23'}]);return false;\">" + spName + "</a><a href=\"#\"><img src=\"images/mn_index_78.gif\" alt=\"\"   onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[i].getAttribute('spName') + "',code:'23'}]);return false;\"/>试听</a></p><p class=\"info\"><a href=\"#\" onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[i].getAttribute('chanName') + "',code:'22'}]);return false;\">" + dir[i].getAttribute('chanName') + "</a><span></span></p></li>";
                    }
                    strHtml += "</ul>";
                    $('DivHeaderSpecial').innerHTML = strHtml;
                }
            } .bind(this)
        });
    },
    BindBodySpecial: function() {
        var url = "GetToDayRecom.php?keyWord=special&signValue=2&time=" + new Date().getTime();
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: function(transport) {
                var myDocument = new ActiveXObject("Microsoft.XMLDOM");
                myDocument.loadXML(transport.responseText);
                var myRoot = myDocument.documentElement;
                var dir = myRoot.getElementsByTagName("specialinfo");

                if (dir != null && dir.length > 0) {
                    var strHtml = "<div class=\"nst\"><p class=\"plimg\" ><img src=\"" + dir[0].getAttribute('imgUrl') + "?" + new Date().getTime() + "\" width=\"188\" height=\"188\" alt=\"\" style=\"cursor:pointer;\"  onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[0].getAttribute('spName') + "',code:'23'}]);return false;\"/></p><p class=\"ptit\">专辑:<a href=\"#\" onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[0].getAttribute('spName') + "',code:'23'}]);return false;\">" + dir[0].getAttribute('spName') + "</a>歌手:<a href=\"#\" onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[0].getAttribute('chanName') + "',code:'22'}]);return false;\">" + dir[0].getAttribute('chanName') + "</a></p><p class=\"ptxt\"><span>专辑简介:</span>" + dir[0].getAttribute('note') + "</p><p class=\"pst\"><span>专辑曲目</span><a href=\"#\"  onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[0].getAttribute('spName') + "',code:'23'}]);return false;\">试听专辑>></a></p><div id=\"DivBodySpecialMusic\">";
                    var murl = "MusicDataXml.php?KeyWord=" + encodeURIComponent(dir[0].getAttribute('spName')) + "&signValue=23&time=" + new Date().getTime();
                    new Ajax.Request(murl, {
                        method: 'get',
                        onSuccess: function(transport) {
                            var strHtml = "<ul class=\"pslt\">";

                            var myDocument = new ActiveXObject("Microsoft.XMLDOM");
                            myDocument.loadXML(transport.responseText);
                            var myRoot = myDocument.documentElement;
                            var dir = myRoot.getElementsByTagName("item");

                            if (dir != null && dir.length > 0) {
                                for (var i = 0; i < 6; i++) {
                                    strHtml += "<li>" + (i + 1) + "　<a href=\"#\" onclick=\"indexPop.listenSelectedMusics([{file:'" + dir[i].getAttribute('file') + "',lrc:'" + dir[i].getAttribute('lrc') + "',title:'" + dir[i].getAttribute('title') + " Live',singer:'" + dir[i].getAttribute('singer') + "',album:'" + dir[i].getAttribute('album') + "',popularity:'" + dir[i].getAttribute('popularity') + "',servercode:'" + dir[i].getAttribute('serverid') + "'}]);return false;\">" + dir[i].getAttribute('title') + "</a></li>";
                                }
                            }
                            strHtml += "</ul>";
                            $('DivBodySpecialMusic').innerHTML = strHtml;
                        }

                    });

                    strHtml += "</div><ul class=\"zjul\">";
                    for (var i = 1; i < 6; i++) {
                        var imgurl = dir[i].getAttribute('imgUrl').length == 0 ? "Images/noimg.jpg" : dir[i].getAttribute('imgUrl');
                        var spName = dir[i].getAttribute('spName').length > 10 ? dir[i].getAttribute('spName').substring(0, 9) : dir[i].getAttribute('spName');
                        strHtml += "<li><a href=\"#\" onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[i].getAttribute('spName') + "',code:'23'}]);return false;\"><img width=\"75\" height=\"75\" src=\"" + imgurl + "?" + new Date().getTime() + "\"  alt=\"\"/></a><a href=\"#\" onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[i].getAttribute('spName') + "',code:'23'}]);return false;\">" + spName + "</a><a href=\"#\" onclick=\"indexPop.ListenSelectdSpecial([{name:'" + dir[0].getAttribute('chanName') + "',code:'22'}]);return false;\">" + dir[i].getAttribute('chanName') + "</a></li>";
                    }
                    strHtml += "</ul>";
                    $('DivBodySpecial').innerHTML = strHtml;
                }
            } .bind(this)
        });
    },
    BindBottomMusicList: function(code, div) {
        var url = "GetToDayRecom.php?keyWord=music&signValue=" + code + "&time=" + new Date().getTime();
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: function(transport) {
                var myDocument = new ActiveXObject("Microsoft.XMLDOM");
                myDocument.loadXML(transport.responseText);
                var myRoot = myDocument.documentElement;
                var dir = myRoot.getElementsByTagName("item");

                if (dir != null && dir.length > 0) {
                    var strHtml = "<div class=\"zjt\"><p class=\"plimg\"><img width=\"79\" height=\"79\" src=\"" + dir[0].getAttribute('imgUrl') + "?" + new Date().getTime() + "\" alt=\"\" /></p><p>歌曲:<a href=\"#\">" + dir[0].getAttribute('title') + "</a></p><p>歌手:<a href=\"#\">" + dir[0].getAttribute('singer') + "</a></p><p>专辑:<a href=\"#\">" + dir[0].getAttribute('album') + "</a></p></div>";
                    strHtml += "<ul>";
                    for (var i = 0; i < dir.length; i++) {
                        var title = dir[i].getAttribute('title').length > 20 ? dir[i].getAttribute('title').substring(0, 19) : dir[i].getAttribute('title');
                        strHtml += "<li><input type=\"checkbox\" name=\"" + div.id + "-" + i + "-\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-file\" value=\"" + dir[i].getAttribute('file') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-lrc\" value=\"" + dir[i].getAttribute('lrc') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-title\" value=\"" + dir[i].getAttribute('title') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-singer\" value=\"" + dir[i].getAttribute('singer') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-album\" value=\"" + dir[i].getAttribute('album') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-popularity\" value=\"" + dir[i].getAttribute('popularity') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-servercode\" value=\"" + dir[i].getAttribute('serverid') + "\" /><a href=\"#\" class=\"name\" onclick=\"indexPop.listenSelectedMusics(indexPop._getSelectSingleMusic('" + div.id + "-" + i + "-'));return false;\">" + title + "</a><a href=\"#\" class=\"gs\" onclick=\"indexPop.listenSelectedMusics(indexPop._getSelectSingleMusic('" + div.id + "-" + i + "-'));return false;\">" + dir[i].getAttribute('singer') + "</a><a href=\"#\" class=\"opl\" onclick=\"indexPop.listenSelectedMusics(indexPop._getSelectSingleMusic('" + div.id + "-" + i + "-'));return false;\"><img src=\"images/mn_index_168.gif\" alt=\"\" /></a></li>";
                    }
                    strHtml += "</ul><div class=\"opck\"><a href=\"#\" onclick=\"indexPop.selectAllMusic('" + div.id + "',1);return false;\">全选</a><a href=\"#\" onclick=\"indexPop.selectAllMusic('" + div.id + "',-1);return false;\">反选</a><a href=\"#\" onclick=\"indexPop.selectAllMusic('" + div.id + "',0);return false;\">取消</a><a href=\"#\" class=\"stx\" onclick=\"indexPop.listenSelectedMusics(indexPop._getSelectedMusics('" + div.id + "'));return false;\">试听所选</a></div>";
                    div.innerHTML = strHtml;
                }
            } .bind(this)
        });
    },
    BindWenDaogameRadioList: function(code) {

    var xj = code == undefined ? new Date().getDay() : code;
        var strHtml = "<ul class=\"wkul\">";
        for (var i = 0; i < wdradiodata[xj].length; i++) {
            strHtml += "<li><span>" + wdradiodata[xj][i].time + "</span><label></label>" + wdradiodata[xj][i].title + "</li>";
        }
        strHtml += "</ul>";
        $('RadioWDListDiv').innerHTML = strHtml;
    },
    BindXiYouRadioList: function(code) {

    var xj = code== undefined ? new Date().getDay():code;
        var strHtml = "<ul class=\"wkul\">";
        for (var i = 0; i < xyradiodata[xj].length; i++) {
            strHtml += "<li><span>" + xyradiodata[xj][i].time + "</span><label></label>" + xyradiodata[xj][i].title + "</li>";
        }
        strHtml += "</ul>";
        $('RadioXYListDiv').innerHTML = strHtml;
    },
    BindRadioMenu: function(mCode, lCode) {
        if (lCode == 1) {
            for (var i = 0; i < 7; i++) {
                $('wdradio-' + i).className = i == mCode ? "on" : "";
            }
            this.BindWenDaogameRadioList(mCode);
        }
        else {
            for (var i = 0; i < 7; i++) {
                $('xyradio-' + i).className = i == mCode ? "on" : "";
            }
            this.BindXiYouRadioList(mCode);
        }
    },
    BindRightMusicList: function(code, div) {
        var url = "GetToDayRecom.php?keyWord=music&signValue=" + code + "&time=" + new Date().getTime();
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: function(transport) {
                var myDocument = new ActiveXObject("Microsoft.XMLDOM");
                myDocument.loadXML(transport.responseText);
                var myRoot = myDocument.documentElement;
                var dir = myRoot.getElementsByTagName("item");

                if (dir != null && dir.length > 0) {
                    var strHtml = "<div class=\"zjt\"><p class=\"plimg\"><img width=\"104\" height=\"79\" src=\"" + dir[0].getAttribute('imgUrl') + "?" + new Date().getTime() + "\" alt=\"\" /></p><p>歌曲:<a href=\"#\">" + dir[0].getAttribute('title') + "</a></p><p>歌手:<a href=\"#\">" + dir[0].getAttribute('singer') + "</a></p><p>专辑:<a href=\"#\">" + dir[0].getAttribute('album') + "</a></p></div>";

                    strHtml += "<div class=\"tit\"><span class=\"pm\">排名</span><span class=\"gm\">歌曲名</span><span class=\"gsm\">歌手名</span></div><ul>";
                    for (var i = 0; i < dir.length; i++) {
                        var title = dir[i].getAttribute('title').length > 15 ? dir[i].getAttribute('title').substring(0, 14) : dir[i].getAttribute('title');
                        strHtml += "<li><input type=\"checkbox\" name=\"" + div.id + "-" + i + "-\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-file\" value=\"" + dir[i].getAttribute('file') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-lrc\" value=\"" + dir[i].getAttribute('lrc') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-title\" value=\"" + dir[i].getAttribute('title') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-singer\" value=\"" + dir[i].getAttribute('singer') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-album\" value=\"" + dir[i].getAttribute('album') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-popularity\" value=\"" + dir[i].getAttribute('popularity') + "\" /><input type=\"hidden\" id=\"" + div.id + "-" + i + "-servercode\" value=\"" + dir[i].getAttribute('serverid') + "\" /><span>" + (i + 1) + "</span><a href=\"#\" class=\"name\" onclick=\"indexPop.listenSelectedMusics(indexPop._getSelectSingleMusic('" + div.id + "-" + i + "-'));return false;\">" + title + "</a><a href=\"#\" class=\"gsm\" onclick=\"indexPop.listenSelectedMusics(indexPop._getSelectSingleMusic('" + div.id + "-" + i + "-'));return false;\">" + dir[i].getAttribute('singer') + "</a></li>";
                    }
                    strHtml += "</ul><div class=\"opck\"><a href=\"#\" onclick=\"indexPop.selectAllMusic('" + div.id + "',1);return false;\">全选</a><a href=\"#\" onclick=\"indexPop.selectAllMusic('" + div.id + "',-1);return false;\">反选</a><a href=\"#\" onclick=\"indexPop.selectAllMusic('" + div.id + "',0);return false;\">取消</a><a href=\"#\" class=\"stx\" onclick=\"indexPop.listenSelectedMusics(indexPop._getSelectedMusics('" + div.id + "'));return false;\">试听所选</a></div>";
                    div.innerHTML = strHtml;
                }
            } .bind(this)
        });
    }
};

/********************功能层********************/
GyyxMusicBoxWeb.IndexPagePop = Class.create();
GyyxMusicBoxWeb.IndexPagePop.prototype = {
    initialize: function() {//初始化
    },
    selectAllMusic: function(target, stat) {
        var target = $(target);
        if (!target) return;
        var objs = target.getElementsByTagName("input");
        for (var i = 0; i < objs.length; i++) {
            if (objs[i].type.toLowerCase() == "checkbox") {
                if (stat == 0) objs[i].checked = false;
                else if (stat == 1) objs[i].checked = true;
                else objs[i].checked = objs[i].checked ? false : true;
            }
        }
    },
    listenSelectedMusics: function(musics) {
        if (musics == null || musics.length == 0) return;
        if (musicObj.musicBox == null || musicObj.musicBox.closed) {
            musicObj.setToPlayMusic(musics);
            musicObj.musicBox = window.open("MusicBox.html?1", "_blank", "resizable=no,scrollbars=no,status=yes,width=874px,height=610px");
        } else {
            try {
                musicObj.musicBox.appendMusicList(musics);
            } catch (e) {
                musicObj.setToPlayMusic(musics);
                musicObj.musicBox = window.open("MusicBox.html?1", "_blank", "resizable=no,scrollbars=no,status=yes,width=874px,height=610px");
            }
        }
        try {
            musicObj.musicBox.focus();
        } catch (e) { }
    },
    ListenSelectdSpecial: function(spName) {

        if (spName == null || spName.length == 0) return;
        if (musicObj.musicBox == null || musicObj.musicBox.closed) {
            musicObj.setToPlayMusic(spName);
            musicObj.musicBox = window.open("MusicBox.aspx?2", "_blank", "resizable=no,scrollbars=no,status=yes,width=874px,height=610px");
        } else {
            try {
                musicObj.musicBox.appendSpecialList(spName);
            } catch (e) {
                musicObj.setToPlayMusic(spName);
                musicObj.musicBox = window.open("MusicBox.aspx?2", "_blank", "resizable=no,scrollbars=no,status=yes,width=874px,height=610px");
            }
        }
        try {
            musicObj.musicBox.focus();
        } catch (e) { }
    },
    _getSelectSingleMusic: function(prefix) {
        var musics = [];
        musics.push({ file: this._getTargetvalue(prefix + 'file', false), lrc: this._getTargetvalue(prefix + 'lrc', false), title: this._getTargetvalue(prefix + 'title'), singer: this._getTargetvalue(prefix + 'singer'), album: this._getTargetvalue(prefix + 'album'), popularity: this._getTargetvalue(prefix + 'popularity'), servercode: this._getTargetvalue(prefix + 'servercode') });
        return musics;
    },
    _getSelectedMusics: function(targetId) {
        var target = $(targetId);
        if (!target) return [];
        var objs = target.getElementsByTagName("input");
        var musicList = [];
        for (var i = 0; i < objs.length; i++) {
            if (objs[i].type.toLowerCase() == "checkbox") {
                if (objs[i].checked) {
                    var prefix = objs[i].name;
                    musicList.push({ file: this._getTargetvalue(prefix + 'file', false), lrc: this._getTargetvalue(prefix + 'lrc', false), title: this._getTargetvalue(prefix + 'title'), singer: this._getTargetvalue(prefix + 'singer'), album: this._getTargetvalue(prefix + 'album'), popularity: this._getTargetvalue(prefix + 'popularity'), servercode: this._getTargetvalue(prefix + 'servercode') });
                }
            }
        }
        return musicList;
    },
    _getTargetvalue: function(targetId, inner, dValue) {
        if ($(targetId)) return inner ? ($(targetId).innerHTML) : ($F(targetId));
        return dValue;
    }
};

/********************与BOX交互数据层********************/
var musicObj = {
    musicBox: null,
    musicList: [],
    getToPlayMusic: function() {
        return this.musicList;
    },
    setToPlayMusic: function(musicList) {
        this.musicList = musicList;
    }
};


/********************radioData********************/
var wdradiodata = new Array();
wdradiodata[1] = [{ time: '0:00-01:00', title: 'DREAM 夜剧场' }, { time: '16:00-17:00', title: '问逍遥' }, { time: '17:00-17:30', title: '资讯点点通' }, { time: '17:30-19:00', title: '风乐谷' }, { time: '19:00-19:30', title: '寻仙问道' }, { time: '19:30-21:00', title: '雄霸天下 天马行空' }, { time: '21:00-22:00', title: '风乐谷' }, { time: '22:00-23:00', title: '穿行在都市' }, { time: '23:00-00:00', title: 'DREAM乐动听'}];
wdradiodata[2] = [{ time: '0:00-01:00', title: 'DREAM 夜剧场' }, { time: '16:00-17:00', title: '问逍遥' }, { time: '17:00-17:30', title: '资讯点点通' }, { time: '17:30-19:00', title: '风乐谷' }, { time: '19:00-19:30', title: '寻仙问道' }, { time: '19:30-21:00', title: '雄霸天下 DJ梦工厂' }, { time: '21:00-22:00', title: '风乐谷' }, { time: '22:00-23:00', title: '穿行在都市' }, { time: '23:00-00:00', title: 'DREAM乐动听'}];
wdradiodata[3] = [{ time: '0:00-01:00', title: 'DREAM 夜剧场' }, { time: '16:00-17:00', title: '问逍遥' }, { time: '17:00-17:30', title: '资讯点点通' }, { time: '17:30-19:00', title: '风乐谷' }, { time: '19:00-19:30', title: '寻仙问道' }, { time: '19:30-21:00', title: '雄霸天下 东拼西凑' }, { time: '21:00-22:00', title: '风乐谷' }, { time: '22:00-23:00', title: '穿行在都市' }, { time: '23:00-00:00', title: 'DREAM乐动听'}];
wdradiodata[4] = [{ time: '0:00-01:00', title: 'DREAM 夜剧场' }, { time: '16:00-17:00', title: '问逍遥' }, { time: '17:00-17:30', title: '资讯点点通' }, { time: '17:30-19:00', title: '风乐谷' }, { time: '19:00-19:30', title: '寻仙问道' }, { time: '19:30-21:00', title: '雄霸天下 决战奥斯卡' }, { time: '21:00-22:00', title: '风乐谷' }, { time: '22:00-23:00', title: '穿行在都市' }, { time: '23:00-00:00', title: 'DREAM乐动听'}];
wdradiodata[5] = [{ time: '0:00-01:00', title: 'DREAM 夜剧场' }, { time: '16:00-17:00', title: '问逍遥' }, { time: '17:00-17:30', title: '资讯点点通' }, { time: '17:30-19:00', title: '风乐谷' }, { time: '19:00-19:30', title: '寻仙问道' }, { time: '19:30-21:00', title: '雄霸天下 问道洗刷刷' }, { time: '21:00-22:00', title: '风乐谷' }, { time: '22:00-23:00', title: '穿行在都市' }, { time: '23:00-00:00', title: 'DREAM乐动听'}];
wdradiodata[6] = [{ time: '0:00-01:00', title: 'DREAM 夜剧场' }, { time: '16:00-17:00', title: '问逍遥周末版' }, { time: '17:00-17:30', title: '资讯点点通' }, { time: '17:30-19:00', title: '风乐谷' }, { time: '19:00-19:30', title: '寻仙问道' }, { time: '19:30-21:00', title: '雄霸天下 答非所闻' }, { time: '21:00-22:00', title: '风乐谷' }, { time: '22:00-23:00', title: '我在问道的日子' }, { time: '23:00-00:00', title: 'DREAM乐动听'}];
wdradiodata[0] = [{ time: '0:00-01:00', title: 'DREAM 夜剧场' }, { time: '16:00-17:00', title: '问逍遥周末版' }, { time: '17:00-17:30', title: '资讯点点通' }, { time: '17:30-19:00', title: '风乐谷' }, { time: '19:00-19:30', title: '寻仙问道' }, { time: '19:30-21:00', title: '雄霸天下 接二连三' }, { time: '21:00-22:00', title: '风乐谷' }, { time: '22:00-23:00', title: '穿行在都市' }, { time: '23:00-00:00', title: 'DREAM乐动听'}];
var xyradiodata = new Array();
xyradiodata[1] = [{ time: '18:00-18:30', title: '弦外之音' }, { time: '18:30-19:00', title: '资讯直通车' }, { time: '19:00-20:00', title: '叽叽歪歪' }, { time: '20:00-21:00', title: '大闹天宫之 句句都很逗' }, { time: '21:00-22:00', title: '听我七十二变' }, { time: '22:00-23:00', title: '闲琴音至'}];
xyradiodata[2] = [{ time: '18:00-18:30', title: '弦外之音' }, { time: '18:30-19:00', title: '资讯直通车' }, { time: '19:00-20:00', title: '叽叽歪歪' }, { time: '20:00-21:00', title: '大闹天宫之 句句都很逗' }, { time: '21:00-22:00', title: '听我七十二变' }, { time: '22:00-23:00', title: '闲琴音至'}];
xyradiodata[3] = [{ time: '18:00-18:30', title: '弦外之音' }, { time: '18:30-19:00', title: '资讯直通车' }, { time: '19:00-20:00', title: '叽叽歪歪' }, { time: '20:00-21:00', title: '大闹天宫之 火眼金睛' }, { time: '21:00-22:00', title: '听我七十二变' }, { time: '22:00-23:00', title: '闲琴音至'}];
xyradiodata[4] = [{ time: '18:00-18:30', title: '弦外之音' }, { time: '18:30-19:00', title: '资讯直通车' }, { time: '19:00-20:00', title: '叽叽歪歪' }, { time: '20:00-21:00', title: '大闹天宫之 火眼金睛' }, { time: '21:00-22:00', title: '听我七十二变' }, { time: '22:00-23:00', title: '闲琴音至'}];
xyradiodata[5] = [{ time: '18:00-18:30', title: '弦外之音' }, { time: '18:30-19:00', title: '资讯直通车' }, { time: '19:00-20:00', title: '叽叽歪歪' }, { time: '20:00-21:00', title: '大闹天宫之 不唱你我他' }, { time: '21:00-22:00', title: '听我七十二变' }, { time: '22:00-23:00', title: '闲琴音至'}];
xyradiodata[6] = [{ time: '18:00-18:30', title: '弦外之音' }, { time: '18:30-19:00', title: '资讯直通车' }, { time: '19:00-20:00', title: '叽叽歪歪' }, { time: '20:00-21:00', title: '大闹天宫之 不唱你我他' }, { time: '21:00-22:00', title: '听我七十二变' }, { time: '22:00-23:00', title: '闲琴音至'}];
xyradiodata[0] = [{ time: '18:00-18:30', title: '弦外之音' }, { time: '18:30-19:00', title: '资讯直通车' }, { time: '19:00-20:00', title: '叽叽歪歪' }, { time: '20:00-21:00', title: '大闹天宫之 不唱你我他' }, { time: '21:00-22:00', title: '听我七十二变' }, { time: '22:00-23:00', title: '闲琴音至'}];
var wdtime = [60, 1020, 1050, 1140, 1170, 1260, 1320, 1380, 1440];
var xytime = [1110, 1140, 1200, 1260, 1320, 1380];

function upWDXYTitle() {
    var tod = new Date();
    var xj = tod.getDay();
    var a = tod.getHours();
    var b = tod.getMinutes();
    var fz = a * 60 + b;
    $('nowWendaoPlayInfo').innerHTML = "音乐欣赏";
    if (fz >= 900 || fz <= 60) {

        for (var i = 0; i < wdtime.length; i++) {
            if (fz < wdtime[i]) {
                $('nowWendaoPlayInfo').innerHTML = wdradiodata[xj][i].title;
                break;
            }
        }
    }
    $('nowXiYouPlayInfo').innerHTML = "音乐欣赏";
    if (fz >= 1020 && fz <= 1320) {

        for (var i = 0; i < xytime.length; i++) {
            if (fz < xytime[i]) {
                $('nowXiYouPlayInfo').innerHTML =  xyradiodata[xj][i].title;
                break;
            }
        }
    }
}
upWDXYTitle();
setInterval("upWDXYTitle();", 60000);

/********************初始化********************/
var indexPop = new GyyxMusicBoxWeb.IndexPagePop();
var ipUI = new GyyxMusicBoxWeb.IndexPageUI();
var netListMusicCode = 0;
var netListMusicArray = [
'W_h.ui<span class="blueFont">收藏了</span>蝴蝶电影原声 - le papil<br/>lonwzp620216<span class="blueFont">收藏了</span>A-SHOW - 谁说我不在乎你<br/>风流小天使<span class="blueFont">收藏了</span>黄阅 - 折子戏<br/>zcj.xxx.com<span class="blueFont">收藏了</span>dj - 金达莱花<br/>dj東傑<span class="blueFont">收藏了</span>灌篮高手 - 直到世界的尽头',
'Q ω -<span class="blueFont">收藏了</span>杨丞琳 - 在你怀里的微笑<br/>xue.peng.ju<span class="blueFont">收藏了</span>理查德.克莱德曼 - embed((纯)钢琴曲-世界名曲-秋日的私语 理查德.克莱德曼)<br/>-Ｍiss.施<span class="blueFont">收藏了</span>S.H.E - 他还是不懂<br/>①個人の天空<span class="blueFont">收藏了</span>TANK - 如果我变成回忆<br/>爱无止境<span class="blueFont">收藏了</span>誓言 - 是谁让我哭了一整夜-tcc国际',
'cg88520<span class="blueFont">收藏了</span>刘德华 - 冰雨<br/>xue.peng.ju<span class="blueFont">收藏了</span>理查德.克莱德曼<br/> - 朋友﹏包、<span class="blueFont">收藏了</span>伊稀(依稀) - 许愿星<br/>箛獨の侽唲<span class="blueFont">收藏了</span>林峰 - 记得忘记<br/>duaiwy<span class="blueFont">收藏了</span>金钟国 - 一个男人',
'阿布<span class="blueFont">收藏了</span>林俊杰 - 不死之身<br/>epowerray<span class="blueFont">收藏了</span>Jon Bon Jovi - Blaze Of Glory<br/>﹏包、<span class="blueFont">收藏了</span>伊稀(依稀) - 别说你还爱着我<br/>清*烟<span class="blueFont">收藏了</span>周杰伦 - 轨迹<br/>lyn19800703<span class="blueFont">收藏了</span>周传雄(小刚) - 关不上的窗',
'vivian<span class="blueFont">收藏了</span>幸田来未 - moon crying<br/>不文<span class="blueFont">收藏了</span>古筝独奏 - 春江花月夜<br/>┏ lvy`<span class="blueFont">收藏了</span>陈绮贞 - 那么就要出发了吗<br/>qq7719984<span class="blueFont">收藏了</span>郑源 - 等<br/>guannanihao<span class="blueFont">收藏了</span>微笑PASTA - 小乌龟_张栋梁'];
function UpdateNetListMusic() {
    if (netListMusicCode >= 4) netListMusicCode = 0;
    $('netListMusic').innerHTML = netListMusicArray[netListMusicCode++];
}
setInterval("UpdateNetListMusic()", 3000);


//function changeLayer() {
//    $("mylayer").style.top = document.documentElement.scrollTop  + $("mylayer").offsetTop + "px";
//}