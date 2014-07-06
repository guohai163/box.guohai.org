/*
*项　目　名：光宇音乐盒
*版　　本　：0.3.1
*作　　者　：H! Guo
*创建时间　：2009-06-10
*最后修改时间：2009-07-07
*/
/********************界面层********************/
GyyxMusicBoxWeb.WebUI = Class.create();
GyyxMusicBoxWeb.WebUI.prototype = {
    initialize: function() {//初始化
        this.lblMusicInfoUI = $('lblMusicInfo'); //页面下侧歌曲信息
        this.ShowMusicList = $('ShowMusicList'); //中间的歌曲列表
        this.State = 2; //按键状态
        this.CreateMusicListNameUI(); //显示弹出菜单
        this.updateCentenMenuOnCode = -1;
        $('playListNameSpan').innerHTML = playMusicList.nowShowListName;
    },
    BindHeaderMusicInfo: function(xDom) {
        var myDocument = new ActiveXObject("Microsoft.XMLDOM");
        myDocument.loadXML(xDom.responseText);
        var myRoot = myDocument.documentElement;
        var dir = myRoot.getElementsByTagName("groupInfo");
        var specialName = dir[0].getAttribute('groupName');
        var specialImg = dir[0].getAttribute('imgUrl');
        var specialDesc = dir[0].getAttribute('Desc');

        var headerMusicInfo = $('headerMusicInfo');
        if (specialImg == undefined || specialImg == null || specialImg.length == 0) {
            headerMusicInfo.innerHTML = "<p class=\"pimg\"><img width=\"77\" height=\"77\" src=\"images/noimg.jpg\" /></p><p><span>名字：</span><span>" + specialName + "</span></p><span style=\"float:right;margin:0px 5px 3px 0px;\"><a href=\"javascript:void(null);\" onclick=\"playMusicList.AddSystemMusicListToUserList();\"><img src=\"images/misli_14.gif\" alt=\"增加本专辑所有歌曲到列表\" /></a></span>";
            $('ShowMusicList').style.height = "385px";
        }
        else {
            var timeValue = new Date().getTime();
            headerMusicInfo.innerHTML = "<p class=\"pimg\"><img width=\"77\" height=\"77\" src=\"" + specialImg + "?" + timeValue + "\" /></p><p><span>名字：</span><span>" + specialName + "</span></p><p><span>简介:</span>" + specialDesc + "</p><p class=\"pr\"><a href=\"javascript:void(null);\" onclick=\"playMusicList.AddSystemMusicListToUserList();\"><img src=\"images/misli_14.gif\" alt=\"\" /></a></p>";
            $('ShowMusicList').style.height = "305px";
        }
    },
    RightNowPlayListUI: function(code, showListName) {//绑定右侧菜单code当前播放歌曲编号,showListName当前显示的列表
        if (showListName != undefined) playMusicList.nowShowListName = showListName;
        if (code == undefined && playMusicList.nowShowListName == playMusicList.nowPlayListName) code = mediaplay.nowPlayCode;
        if (code == undefined) code = -1;
        if (playMusicList.myMusicListStateShow == 1) {
            if (cookiesWork.checkCookie(playMusicList.nowShowListName)) {
                cookiesWork.getData(playMusicList.nowShowListName);
                if (MyMusicDataList[playMusicList.nowShowListName] != null && MyMusicDataList[playMusicList.nowShowListName].length > 0) {
                    var tmpData = MyMusicDataList[playMusicList.nowShowListName];
                    var strTemp = "<ul class=\"mrltul\">";
                    for (var i = 0; i < tmpData.length; i++) {
                        var tmp = code == i ? " class=\"on\" " : "";
                        var title = tmpData[i].title.length > 6 ? tmpData[i].title.substring(0, 6) : tmpData[i].title;
                        strTemp += "<li" + tmp + "><a href=\"#\" onclick=\"playMusicList.PlayNowShowMusic(" + i + ");\" class=\"gm\">" + title + "</a><a href=\"#\" onclick=\"playMusicList.PlayNowShowMusic(" + i + ");\" class=\"gs\">" + tmpData[i].singer + "</a><a href=\"#\" onclick=\"playMusicList.DelMusicToNowPlayList(" + i + ");\"><img src=\"images/ximg.gif\" /></a></li>";
                    }
                    strTemp += "</ul>";
                    nowPlayList.innerHTML = strTemp;
                }
                else {
                    nowPlayList.innerHTML = "";
                }
            }
            else {
                nowPlayList.innerHTML = "";
            }
        }
        else if (playMusicList.myMusicListStateShow == 2) {
            if (MyServerMusicDataList[playMusicList.nowShowListName] != null && MyServerMusicDataList[playMusicList.nowShowListName].length > 0) {
                var tmpData = MyServerMusicDataList[playMusicList.nowShowListName];
                var strTemp = "<ul class=\"mrltul\">";
                for (var i = 0; i < tmpData.length; i++) {
                    var tmp = code == i ? " class=\"on\" " : "";
                    strTemp += "<li" + tmp + "><a href=\"#\" onclick=\"playMusicList.PlayNowShowMusic(" + i + "); \" class=\"gm\">" + tmpData[i].title + "</a><a href=\"#\" onclick=\"playMusicList.PlayNowShowMusic(" + i + ");\" class=\"gs\">" + tmpData[i].singer + "</a><a href=\"#\" onclick=\"playMusicList.DelMusicToNowPlayList(" + i + ");\"><img src=\"images/ximg.gif\" /></a></li>";
                }
                strTemp += "</ul>";
                nowPlayList.innerHTML = strTemp;
            }
            else {
                nowPlayList.innerHTML = "";
            }
        }
        $('playListNameSpan').innerHTML = playMusicList.nowShowListName.length > 5 ? playMusicList.nowShowListName.substring(0, 5) + '...' : playMusicList.nowShowListName;
    },
    MakeButtonUI: function(buttonId, state) {//改变按键状态
        if (state != undefined) {
            this.State = state;
        }
        if (buttonId == "imgMute") {
            var x = mediaplay.getMuteState() ? "F" : "T";
            $(buttonId).src = "images/" + buttonId + x + "_" + this.State + ".gif";
        }
        else if (buttonId == "imgPlay") {
            var x = mediaplay.getMediaInfo(5);

            if (x == 1 || x == 2 || x == 10 || x == 0) {
                $(buttonId).src = "images/imgPlay_2.gif";
            }
            else {
                $(buttonId).src = "images/imgPause_2.gif";
            }
        }
        else {
            $(buttonId).src = "images/" + buttonId + "_" + this.State + ".gif";
        }
    },
    RefurbishUI: function() {//刷新页面
        if ((playMusicList.myMusicListStatePlay == 1 && MyMusicDataList[playMusicList.nowPlayListName] != null && MyMusicDataList[playMusicList.nowPlayListName].length > 0) || (playMusicList.myMusicListStatePlay == 2 && MyServerMusicDataList[playMusicList.nowPlayListName] != null && MyServerMusicDataList[playMusicList.nowPlayListName].length > 0)) {
            this.lblMusicInfoUI.innerHTML = mediaplay.getMediaInfo(6) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + mediaplay.getMediaInfo(2) + "&nbsp;|&nbsp;" + mediaplay.getMediaInfo(4) + "";
            var tmpValue = mediaplay.getMediaInfo(1) / mediaplay.getMediaInfo(3);
            tmpValue = isNaN(tmpValue) ? 0 : tmpValue;
            var tmpx = mediaplay.getMediaInfo(5);
            var tmpImg = "";
            switch (tmpx) {
                case 1:
                    tmpImg = "images/music_2.gif";
                    break;
                case 2:
                    tmpImg = "images/music_2.gif";
                    break;
                case 3:
                    tmpImg = "images/music.gif";
                    break;
                case 6:
                    tmpImg = "images/loading.gif";
                    break;
                case 9:
                    tmpImg = "images/loading.gif";
                    break;
                default:
                    tmpImg = "images/music_2.gif";
            }
            var musicstateimg = $('musicstateimg');
            musicstateimg.src = tmpImg;
            playSlider.setValue(tmpValue, 0);
            webui.MakeButtonUI('imgPlay');
            // 当一曲播放完毕
            if (mediaplay.getMediaInfo(5) == 1 && mediaplay.PlayState == 1) mediaplay.playNext();
        }
    },
    BindChansonnierList: function(initial) {
        if (initial != undefined) {
            var url = 'GetChansonnierList.aspx';
            var pars = 'initial=' + encodeURI(initial) + '&timetemp=' + new Date().getTime();
            new Ajax.Request(url, { method: 'get', parameters: pars, onComplete: function(originalRequest) { $("chansonnierDataList").innerHTML = originalRequest.responseText; } });
        }
    },
    BindCentenMenu: function(listName, code, singValue) {//绑定中间的菜单
        if (singValue != undefined) {
            var url = "GetGroupInfo.aspx?KeyWord=" + encodeURIComponent(listName.replace(/^[LS]/g, '')) + "&signValue=" + singValue + "&timestamp=" + new Date().getTime();
            new Ajax.Request(url, {
                method: 'get',
                onSuccess: this.BindHeaderMusicInfo.bind(this)
            });
        }
        if (musicList.nowShowListName != listName && singValue != undefined && musicList.nowShowListName.charAt(0) == "S")//如果是搜索的回收资源
        {
            SystemMusicDataList[musicList.nowShowListName] = null;
            if (isIE) setTimeout(CollectGarbage, 10);
        }
        if (code == undefined) code = -1;
        if (singValue == undefined) singValue = 1;
        if (SystemMusicDataList[listName] == null || SystemMusicDataList[listName].length == 0) {
            musicList.GetData(listName, singValue);
        }
        var tmpList = SystemMusicDataList[listName];
        if (tmpList == null || tmpList == undefined) return;
        var strTemp = "<ul class=\"mprglc\">";
        for (var i = 0; i < tmpList.length; i++) {
            var album = tmpList[i].album.length > 10 ? tmpList[i].album.substring(0, 10) + '...' : tmpList[i].album;
            strTemp += "<li id=\"CentenMenu" + i + "\" ondblclick=\"playMusicList.AddMusicToNowPlayList(" + tmpList[i].code + ",'" + tmpList[i].file + "','" + tmpList[i].lrc + "','" + tmpList[i].title + "','" + tmpList[i].singer + "','" + tmpList[i].album + "'," + tmpList[i].popularity + "," + tmpList[i].servercode + ");\" onclick=\"webui.UpdateCentenMenuOn(" + i + ");\"><span class=\"gm\">" + tmpList[i].title + "</span><span class=\"gs\">" + tmpList[i].singer + "</span><span class=\"zj\">" + album + "</span><a href=\"#\" onclick=\"playMusicList.AddMusicToNowPlayList(" + tmpList[i].code + ",'" + tmpList[i].file + "','" + tmpList[i].lrc + "','" + tmpList[i].title + "','" + tmpList[i].singer + "','" + tmpList[i].album + "'," + tmpList[i].popularity + "," + tmpList[i].servercode + ");\"><span class=\"st\"><img src=\"images/misli_33.gif\" /></span></a><span class=\"rq\"><img src=\"images/popularity_" + tmpList[i].popularity + ".gif\" /></span></li>";
        }
        strTemp += "</ul>";
        ShowMusicList.innerHTML = strTemp;
        webui.WebTop2UI(2);
    },
    BindCentenMenuNew: function(dataCode, code, singValue) {
        if (singValue != undefined) {
            var url = 'GetGroupInfoNew.aspx';
            var pars = 'code=' + dataCode + '&signValue=' + singValue + '&timestamp' + new Date().getTime();
            new Ajax.Request(url, { method: 'get', parameters: pars, onSuccess: this.BindHeaderMusicInfo.bind(this) });
        }
        if (musicList.nowShowListName != dataCode && singValue != undefined && musicList.nowShowListName.charAt(0) == "S") {
            SystemMusicDataList[musicList.nowShowListName] = null;
            if (isIE) setTimeout(CollectGarbage, 10);
        }
        if (code == undefined) code = -1;
        if (singValue == undefined) singValue = 1;
        if (SystemMusicDataList[dataCode] == null || SystemMusicDataList[dataCode].length == 0) {
            this.nowShowListName = dataCode;
            var fileName = "MusicDataXml.aspx?KeyWord=" + encodeURIComponent(dataCode.replace(/^[LS]/g, '')) + "&signValue=" + singValue;
            if (SystemMusicDataList[dataCode] == null || SystemMusicDataList[dataCode].length == 0)
                var tempClass = new GyyxMusicBoxWeb.MusicDataListXml();
            tempClass.xmlDom(fileName, tempClass.bindXmlData, this.nowShowListName, singValue);
        }
        var tmpList = SystemMusicDataList[dataCode];
        if (tmpList == null || tmpList == undefined) return;
        var strTemp = "<ul class=\"mprglc\">";
        for (var i = 0; i < tmpList.length; i++) {
            var album = tmpList[i].album.length > 10 ? tmpList[i].album.substring(0, 10) + '...' : tmpList[i].album;
            strTemp += "<li id=\"CentenMenu" + i + "\" ondblclick=\"playMusicList.AddMusicToNowPlayList(" + tmpList[i].code + ",'" + tmpList[i].file + "','" + tmpList[i].lrc + "','" + tmpList[i].title + "','" + tmpList[i].singer + "','" + tmpList[i].album + "'," + tmpList[i].popularity + "," + tmpList[i].servercode + ");\" onclick=\"webui.UpdateCentenMenuOn(" + i + ");\"><span class=\"gm\">" + tmpList[i].title + "</span><span class=\"gs\">" + tmpList[i].singer + "</span><span class=\"zj\">" + album + "</span><a href=\"#\" onclick=\"playMusicList.AddMusicToNowPlayList(" + tmpList[i].code + ",'" + tmpList[i].file + "','" + tmpList[i].lrc + "','" + tmpList[i].title + "','" + tmpList[i].singer + "','" + tmpList[i].album + "'," + tmpList[i].popularity + "," + tmpList[i].servercode + ");\"><span class=\"st\"><img src=\"images/misli_33.gif\" /></span></a><span class=\"rq\"><img src=\"images/popularity_" + tmpList[i].popularity + ".gif\" /></span></li>";
        }
        strTemp += "</ul>";
        ShowMusicList.innerHTML = strTemp;
        webui.WebTop2UI(2);
    },
    BindCentenMenuByCode: function(code, singValue) {//绑定中间的菜单
        if (singValue != undefined) {
            var url = "GetGroupInfo.aspx?KeyWord=" + listName + "&signValue=" + singValue + "&timestamp=" + new Date().getTime();
            new Ajax.Request(url, {
                method: 'get',
                onSuccess: this.BindHeaderMusicInfo.bind(this)
            });
        }
        if (musicList.nowShowListName != listName && singValue != undefined && musicList.nowShowListName.charAt(0) == "S")//如果是搜索的回收资源
        {
            SystemMusicDataList[musicList.nowShowListName] = null;
            if (isIE) setTimeout(CollectGarbage, 10);
        }
        if (code == undefined) code = -1;
        if (singValue == undefined) singValue = 1;
        if (SystemMusicDataList[listName] == null || SystemMusicDataList[listName].length == 0) {
            musicList.GetData(listName, singValue);
        }
        var tmpList = SystemMusicDataList[listName];
        if (tmpList == null || tmpList == undefined) return;
        var strTemp = "<ul class=\"mprglc\">";
        for (var i = 0; i < tmpList.length; i++) {
            var album = tmpList[i].album.length > 10 ? tmpList[i].album.substring(0, 10) + '...' : tmpList[i].album;
            strTemp += "<li id=\"CentenMenu" + i + "\" ondblclick=\"playMusicList.AddMusicToNowPlayList(" + tmpList[i].code + ",'" + tmpList[i].file + "','" + tmpList[i].lrc + "','" + tmpList[i].title + "','" + tmpList[i].singer + "','" + tmpList[i].album + "'," + tmpList[i].popularity + "," + tmpList[i].servercode + ");\" onclick=\"webui.UpdateCentenMenuOn(" + i + ");\"><span class=\"gm\">" + tmpList[i].title + "</span><span class=\"gs\">" + tmpList[i].singer + "</span><span class=\"zj\">" + album + "</span><a href=\"#\" onclick=\"playMusicList.AddMusicToNowPlayList(" + tmpList[i].code + ",'" + tmpList[i].file + "','" + tmpList[i].lrc + "','" + tmpList[i].title + "','" + tmpList[i].singer + "','" + tmpList[i].album + "'," + tmpList[i].popularity + "," + tmpList[i].servercode + ");\"><span class=\"st\"><img src=\"images/misli_33.gif\" /></span></a><span class=\"rq\"><img src=\"images/popularity_" + tmpList[i].popularity + ".gif\" /></span></li>";
        }
        strTemp += "</ul>";
        ShowMusicList.innerHTML = strTemp;
        webui.WebTop2UI(2);
    },
    UpdateCentenMenuOn: function(code) {//更新中间菜单的ON选项
        if (code >= 0 && code != this.updateCentenMenuOnCode) {
            if (this.updateCentenMenuOnCode >= 0) {
                $('CentenMenu' + this.updateCentenMenuOnCode).className = "";
            }
            this.updateCentenMenuOnCode = code;
            $('CentenMenu' + this.updateCentenMenuOnCode).className = "on";
        }
    },
    WebTop2UI: function(value) {//顶部二级菜单，value当前先中的菜单ID
        var divUI = $('nowpalyDiv', 'todayDiv', 'netMusicDiv');
        var menuUI = $('nowpalyMenu', 'todayMenu', 'netMusicMenu');
        for (var i = 0; i < divUI.length; i++) {
            if (i == value) {
                divUI[i].style.display = "";
                menuUI[i].style.background = "url(../images/mtb2_06.gif)";
            }
            else {
                divUI[i].style.display = "none";
                menuUI[i].style.background = "url(../images/mtb2_08.gif)";
            }
        }
    },
    WebTopUI: function(value) {
        var divUIId = $('allRightIndent', 'gamePageData');
        var menuUI = $('menuMusicId', 'menuGameId');
        for (var i = 0; i < divUIId.length; i++) {
            if (i == value) {
                divUIId[i].style.display = "";
                menuUI[i].className = "on_0" + (i+1);
            } else {
                divUIId[i].style.display = "none";
                menuUI[i].className = "";
            }
        }
    },
    CreateMusicListNameUI: function() {//创建歌曲播放列表组
        this.MusicListNameDiv = $('MusicListNameDiv', 'MusicListNameDivLeft', 'MusicListNameDivRight');
        var strTemp = new Array();
        strTemp[0] = "<ul>";
        strTemp[1] = "<ul>";
        if (userData.loginState == 1) {
            for (var i = 0; i < playMusicList.myServerMusicListName.length; i++) {
                var listName = playMusicList.myServerMusicListName[i].length > 5 ? playMusicList.myServerMusicListName[i].substring(0, 5) + '...' : playMusicList.myServerMusicListName[i];
                if (playMusicList.myServerMusicListName[i] == playMusicList.nowShowListName && playMusicList.myMusicListStateShow == 2) {
                    strTemp[0] += "<li class=\"leftwx\">√</li>";
                    strTemp[1] += "<li class=\"linwx\">" + listName + "</li>";
                }
                else {
                    strTemp[0] += "<li></li>";
                    strTemp[1] += "<li style=\"cursor:hand;\" onclick=\"playMusicList.myMusicListStateShow=2;playMusicList.nowShowListName='" + playMusicList.myServerMusicListName[i] + "';webui.clonseDiv('MusicListNameDiv');webui.RightNowPlayListUI();\">" + listName + "</li>";
                }
            }
        }
        for (var i = 0; i < playMusicList.myMusicListName.length; i++) {
            var listName = playMusicList.myMusicListName[i].length > 5 ? playMusicList.myMusicListName[i].substring(0, 5) + '...' : playMusicList.myMusicListName[i];
            if (playMusicList.myMusicListName[i] == playMusicList.nowShowListName && playMusicList.myMusicListStateShow == 1) {
                strTemp[0] += "<li class=\"leftwx\">√</li>";
                strTemp[1] += "<li class=\"linwx\">" + listName + "</li>";
            }
            else {
                strTemp[0] += "<li></li>";
                strTemp[1] += "<li style=\"cursor:hand;\" onclick=\"playMusicList.myMusicListStateShow=1;playMusicList.nowShowListName='" + playMusicList.myMusicListName[i] + "';webui.clonseDiv('MusicListNameDiv');webui.RightNowPlayListUI();\">" + listName + "</li>";
            }
        }
        strTemp[0] += "<li></li></ul>";
        strTemp[1] += "<li class=\"linwx1\"><a href=\"javascript:void(null);\" onclick=\"webui.CreateMusicListDiv();\">创建播放列表</a></li></ul>";
        this.MusicListNameDiv[1].innerHTML = strTemp[0];
        this.MusicListNameDiv[2].innerHTML = strTemp[1];
    },
    CreateMusicListDiv: function() {//创建弹出层
        var userInfoDiv = $('userInfoDiv');
        userInfoDiv.style.left = document.body.clientWidth / 2 - 200 + "px";
        userInfoDiv.style.display = "";
        var strTemp = "";
        if (userData.loginState == 0) {
            strTemp += "<h5>新建播放列表<a href=\"javascript:void(null);\" onclick=\"webui.clonseDiv('userInfoDiv');\" class=\"close\"><img src=\"images/anlist_08.gif\"  /></a></h5>	<div class=\"view\">		<p class=\"stxt\" >请先登陆再来创建播放列表:</p>		<p class=\"pint\"></p>		<p class=\"pcon\"><input type=\"button\" class=\"sub_cel\" value=\"\" onclick=\"webui.clonseDiv('userInfoDiv');\" /></p>	</div>";
        }
        else {
            strTemp += "<h5>新建播放列表<a href=\"javascript:void(null);\" onclick=\"webui.clonseDiv('userInfoDiv');\" class=\"close\"><img src=\"images/anlist_08.gif\"  /></a></h5>	<div class=\"view\">		<p class=\"stxt\" >请输入名称:</p>		<p class=\"pint\"><input type=\"text\" id=\"tbNewListName\"/></p>		<p class=\"pcon\"><input type=\"button\" class=\"sub_ok\" value=\"\" onclick=\"if(playMusicList.AddMusicListName($F('tbNewListName')))webui.clonseDiv('userInfoDiv');\" /><input type=\"button\" class=\"sub_cel\" value=\"\" onclick=\"webui.clonseDiv('userInfoDiv');\" /></p>	</div>";
        }
        userInfoDiv.innerHTML = strTemp;
    },
    clonseDiv: function(value) {//关闭指定 DIV
        $(value).style.display = "none";
    },
    showDiv: function(value) {//让指定DIV可见
        $(value).style.display = "";
    },
    WindowMakeSize: function() {//当窗体改变大小 时
        var userInfoDiv = $('userInfoDiv');
        if (userInfoDiv.style.display == "") userInfoDiv.style.left = document.body.clientWidth / 2 - 200 + "px";
    },
    UserLoginUI: function() {

        if (userData.loginState == 0) {
            this.UserLogoutUI();
        }
        else {
            var strHtml = "<div style=\"float:left; width:50px; margin-left:2px;\"><p class=\"pimg\"><img src=\"images/mrbj_03.gif\" alt=\"\" /></p></div><div style=\"float:left;width:85px;margin-left:5px;\"><p>" + userData.username + "<br />积分：" + userData.integral + "</p> <p>等级：" + userData.userLevelImg + "</p></div><div style=\"margin-top:130px;margin-left:100px;\"><a href=\"#\" onclick=\"userData.logout();\">注销</a></div>";
            $('userLogin').innerHTML = strHtml;
        }
    },
    UserLogoutUI: function() {
        if (userData.loginState == 1) {
            this.UserLoginUI();
        }
        else {
            var strHtml = "<p class=\"pimg\"><img src=\"images/mrbj_03.gif\" alt=\"\" /></p><p>听歌就送积分<br />　</p><p><label>用户名</label><input id=\"userName\" type=\"text\" class=\"w100\" /></p><p><label>密　码</label><input id=\"passWord\" type=\"password\" class=\"w100\" /></p><a href=\"#\" class=\"wx1\" onclick=\"userData.login($F('userName'),$F('passWord'));\" ></a><a class=\"wx\" href=\"http:\/\/www.gyyx.cn/member/MyRegister1.aspx\" target=\"_blank\" ></a>";
            $('userLogin').innerHTML = strHtml;
        }
    },
    UpdateLrcOrMp: function(code) {
        if (code == 1) {
            $('lrcormp').innerHTML = "<ul class=\"lrcHeader\"><li class=\"on\">歌词</li><li style=\"cursor: hand;\" onclick=\"webui.UpdateLrcOrMp(2);\" onmousemove=\"this.className='mouse'\" onmouseout=\"this.className=''\">旋律</li></ul>";
            $('mpl').style.display = "none";
            $('lrc').style.display = "";
        }
        else {
            $('lrcormp').innerHTML = "<ul class=\"lrcHeader\"><li style=\"cursor: hand;\" onclick=\"webui.UpdateLrcOrMp(1);\" onmousemove=\"this.className='mouse'\" onmouseout=\"this.className=''\">歌词</li><li class=\"on\">旋律</li></ul>";
            $('mpl').style.display = "";
            $('lrc').style.display = "none";
        }
    }
};
/********************数据缓存放于JS内********************/
GyyxMusicBoxWeb.MusicDataListXml = Class.create();
GyyxMusicBoxWeb.MusicDataListXml.prototype = {
    initialize: function() {
        this.nowShowListName = "";
    },
    GetData: function(KeyWord, signValue) {//从后台取数据到SystemMusicDataList，KeyWord关键字，signValue标志位1左侧调用 ，2开头搜索，3开头用户数据 
        this.nowShowListName = KeyWord;
        var fileName = "MusicDataXml.aspx?KeyWord=" + encodeURIComponent(KeyWord.replace(/^[LS]/g, '')) + "&signValue=" + signValue;
        if (SystemMusicDataList[KeyWord] == null || SystemMusicDataList[KeyWord].length == 0) this.xmlDom(fileName, this.bindXmlData, this.nowShowListName, signValue);
    },
    GetUserData: function(listName, KeyWord, signValue) {//给用户调用 取数据
        var fileName = "MusicDataXml.aspx?KeyWord=" + encodeURIComponent(KeyWord) + "&signValue=" + signValue;
        if (signValue == 3) {
            if (MyMusicDataList[listName] == null || MyMusicDataList[listName].length == 0) this.xmlDom(fileName, this.bindXmlData, listName, signValue);
        }
        else if (signValue == 4) {
            if (MyServerMusicDataList[listName] == null || MyServerMusicDataList[listName].length == 0) this.xmlDom(fileName, this.bindXmlData, listName, signValue);
        }

    },
    xmlDom: function(file, handle, KeyWord, signValue)	//创建xmldom,返回xmldom对象,	handle(xmldom)
    {
        var XMLDom = null;
        var MS_XML_DOM = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom"];
        if (isIE)//试用XML文档对象
        {
            for (var i = 0; i < MS_XML_DOM.length; i++)
            { try { XMLDom = new ActiveXObject(MS_XML_DOM[i]); break; } catch (e) { } }
        }
        else XMLDom = document.implementation.createDocument("", "", null);
        XMLDom.async = false;
        XMLDom.preserveWhiteSpace = true; //兼容FireFox

        try {
            if (isIE) XMLDom.onreadystatechange = function() { if (XMLDom.readyState == 4) handle(XMLDom, KeyWord, signValue); };
            else XMLDom.onload = function() { handle(XMLDom, KeyWord, signValue); };
            XMLDom.load(file);
        } catch (e) { }
    },
    bindXmlData: function(xDom, KeyWord, signValue)	//将读取的xml输出到数据缓存
    {
        var dir = xDom.getElementsByTagName("item"); //(item)子目录集合
        var tmpData = new Array();
        for (var i = 0; i < dir.length; i++) {
            tmpData[i] = new SingleMusicDataInfo(i, dir[i].getAttribute('file'), dir[i].getAttribute('lrc'), dir[i].getAttribute('title'), dir[i].getAttribute('singer'), dir[i].getAttribute('album'), dir[i].getAttribute('popularity'), dir[i].getAttribute('serverid'));
        }
        if (signValue == 3) {
            MyMusicDataList[KeyWord] = tmpData;
        }
        else if (signValue == 4) {
            MyServerMusicDataList[KeyWord] = tmpData;
        }
        else {
            SystemMusicDataList[KeyWord] = tmpData;
        }
    }
};
/********************播放列表存在COOKIE内的********************/
GyyxMusicBoxWeb.MusicDateListCookie = Class.create();
GyyxMusicBoxWeb.MusicDateListCookie.prototype = {
    initialize: function() {//初始化
    },
    getData: function(listName) {//取数据，对外
        if (listName != null && listName.length > 0)//检查listName是否为空
        {
            var cookie = this.GetCookie(listName);
            if (cookie != null && cookie.length > 0) this.bindcookiesData(cookie, listName);
        }
    },
    checkCookie: function(listName) {//检查是否有当前 COOKIES
        if (this.GetCookie(listName) == null)
        {return false;}
        else
        {return true;}
    },
    addData: function(listName, musicObj) {//增加新的歌曲到这里，对外
        if (this.GetCookie(listName))//检查是否已经有此COOKIE再分别不同操作
        {//不为空时
            if (MyMusicDataList[listName] == null || MyMusicDataList[listName].length == 0) this.getData(listName); //检查是否从COOKIE里取过此列表到缓存
            if (this.checkCookieValue(listName, musicObj)) MyMusicDataList[listName][MyMusicDataList[listName].length] = musicObj;
            if (playMusicList.nowPlayListName == listName) {//如果操作的列表为当前播放的列表则做此操作
                mediaplay.MusicBoxCount = MyMusicDataList[playMusicList.nowPlayListName].length;
                mediaplay.NowMusicBoxList = MyMusicDataList[playMusicList.nowPlayListName];
            }
        }
        else {
            var tmpData = new Array();
            tmpData[0] = musicObj;
            MyMusicDataList[listName] = tmpData;
            if (playMusicList.nowPlayListName == listName) {
                mediaplay.MusicBoxCount = MyMusicDataList[playMusicList.nowPlayListName].length;
                mediaplay.NowMusicBoxList = MyMusicDataList[playMusicList.nowPlayListName];
            }
        }
        this.updateData(listName);
    },
    delData: function(listName, code) {//删除一个COOKIES

        if (this.GetCookie(listName))//检查是否已经有此COOKIE再分别不同操作
        {
            if (MyMusicDataList[listName] == null || MyMusicDataList[listName].length == 0) this.getData(listName); //检查是否从COOKIE里取过此列表到缓存
            if (MyMusicDataList[listName].length > code);
            {
                MyMusicDataList[listName][code] = null;
                this.updateData(listName);
                this.getData(listName);
                if (playMusicList.nowPlayListName == listName) {
                    mediaplay.MusicBoxCount = MyMusicDataList[playMusicList.nowPlayListName].length;
                    mediaplay.NowMusicBoxList = MyMusicDataList[playMusicList.nowPlayListName];
                }
            }
        }
    },
    /***歌曲列表明操作***/
    getMusicListName: function() {//取歌曲列表数组
        var cookies = this.GetCookie("@MusicListName");
        var tmpData = new Array();
        if (cookies != null && cookies.length > 0) {
            tmpData = cookies.split(",");
        }
        else {
            tmpData[0] = "默认列表";
        }
        return tmpData;
    },
    addMusicListName: function(value) {//增加一个列表
        var tmpData = this.getMusicListName();
        tmpData[tmpData.length] = value;
        var strTmp = tmpData.join(",");
        this.SetCookie("@MusicListName", strTmp);
    },
    checkMusicListName: function(value) {//检查一个列表
        if (this.getMusicListName().indexOf(value) == -1) return false;
        else {return true;}
    },
    delMusicListName: function(value) {//删除一个列表名
        if (value == "默认列表") {
            alert("对不起系统默认列表无法删除！");
            return;
        }
        var x = this.getMusicListName();
        var y = x.indexOf(value);
        if (y != -1) {
            x = x.without(value);
            this.SetCookie("@MusicListName", x.join(","));
        }
    },
    SetCookie: function(name, value) {//两个参数，一个是cookie的名子，一个是值,对内
        var Days = 365; //此 cookie 将被保存 30 天
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    GetCookie: function(name) {//取cookies函数,对内
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]); return null;
    },
    DelCookie: function(name) {//删除cookie,对内
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = CookieClass.prototype.GetCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    bindcookiesData: function(strData, suffix) {//绑定数据strData 为从COOKIE里取出的数据格式为歌曲在服务器上ID "abc,abc,abc;abc,abc,abc",对内
        if (strData != null && strData.length > 0) {
            if (MyMusicDataList[suffix] == null || MyMusicDataList[suffix].Length <= 0) musicList.GetUserData(suffix, strData, 3);
        }
    },
    checkCookieValue: function(suffix, musicObj) {//是否有此值,对内
        var fla = true;
        if (MyMusicDataList[suffix] != null && MyMusicDataList[suffix].length > 0) {

            for (var i = 0; i < MyMusicDataList[suffix].length; i++) {
                if (MyMusicDataList[suffix][i].servercode == musicObj.servercode) fla = false;
            }
        }
        return fla;
    },
    updateData: function(suffix) {//更新数据到COOKIE,对内
        if (MyMusicDataList[suffix] != null && MyMusicDataList[suffix].length > 0) {
            var tmpMusicData = MyMusicDataList[suffix];
            var strArray = new Array();
            var strArray1 = new Array();
            var j = 0;
            for (var i = 0; i < tmpMusicData.length; i++) {
                if (tmpMusicData[i] != null) {
                    strArray[j] = tmpMusicData[i].servercode;
                    strArray1[j] = tmpMusicData[i];
                    strArray1[j].code = j;
                    j++;
                }
            }
            MyMusicDataList[suffix] = strArray1;
            this.SetCookie(suffix, strArray.join(","));
        }
    }
};
/********************歌词********************/
GyyxMusicBoxWeb.MusicLrcWord = Class.create();
GyyxMusicBoxWeb.MusicLrcWord.prototype = {
    initialize: function() {//初始化
    },
    tochinese: function(x) {//xhttp编码输出中文,(by:Rimifon)最好是将歌词utf-8编码就不需要此函数转化了
        try {
            var Rec = new ActiveXObject("ADODB.RecordSet");
            Rec.Fields.Append("DDD", 201, 1);
            Rec.Open();
            Rec.AddNew();
            Rec(0).AppendChunk(x.responseBody);
            Rec.Update();
            var HTML = Rec(0).Value;
            Rec.Close();
            delete Rec;
            return HTML;
        }
        catch (e) { return x.responseText; }
    },
    echo_lrc: function(str) {//将歌词字符输出
        if (/\[offset\:(\-?\d+)\]/i.test(str))		//取offset余补时间
            offSet = RegExp.$1 / 1000;
        str = str.replace(/^\[ti\:([^\]]*)\]\r/mg, '<div style="color:#0173e5;over-flow:hidden;font-weight:bold;">歌曲:《$1》</div>');
        str = str.replace(/^\[ar\:([^\]]*)\]\r/mg, '<div style="color:#0173e5;over-flow:hidden;font-weight:bold">演唱者:$1</div>');
        str = str.replace(/^\[al\:([^\]]*)\]\r/mg, '<div style="color:#0173e5;over-flow:hidden;font-weight:bold">专集:$1</div>');
        str = str.replace(/^\[by\:([^\]]*)\]\r/mg, '<div style="color:#0173e5;over-flow:hidden;font-weight:bold;">制作:$1</div>');
        str = str.replace(/\[\:\][^$\n]*(\n|$)/g, "$1");
        str = str.replace(/\]\[/g, '|');
        str = str.replace(/^\[([\d\:\.\|]+)\]([^\r]*)\s*$/mg, '<div id="_time" style="cursor:hand;" time="$1">$2</div>');
        str = str.replace(/\[[\w-:]*\]\s*/g, '');
        str = str.replace(/(\r\n\s*){2,}/g, '<br\/>');
        $("lrc").innerHTML = str;
    },
    xmlHttp: function(file) {//创建xmlhttp对象handle(str)
        var xmlhttp = null;
        var MS_XML_HTTP = ["Msxml5.XMLHTTP", "Msxml4.XMLHTTP", "Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
        if (isIE) {
            for (var i = 0; i < MS_XML_HTTP.length; i++) {
                try { xmlhttp = new ActiveXObject(MS_XML_HTTP[i]); break; } catch (e) { }
            }
        }
        else xmlhttp = new XMLHttpRequest();
        try {
            xmlhttp.open("GET", file, false);
            if (isIE) {
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4) { this.echo_lrc(this.tochinese(xmlhttp)); }
                } .bind(this);
            }
            else xmlhttp.onload = function() { this.echo_lrc(this.tochinese(xmlhttp)); } .bind(this); xmlhttp.send(null);
        } catch (e) { $("lrc").innerHTML = '歌词地址有错，不能载入！'; }
    },
    showLrc: function() {//进度控制歌词
        var cT = mediaplay.getMediaInfo(1); //当前秒
        var aT = mediaplay.getMediaInfo(3); //总秒数
        var arr = document.getElementsByName("_time");
        var i, j, k = 0, sp, tArr = [], t = '';
        for (i = 0; i < arr.length; i++) {
            if (/\|/g.test(arr[i].time))	//相同歌词有很多时间00:12.22|12:12.58
            {
                tArr = arr[i].time.split("|");
                for (k = 0; k < tArr.length; k++)
                { tArr[k] = parseInt(tArr[k].split(':')[0]) * 60 + Math.floor(tArr[k].split(':')[1]); }
                t = ',' + tArr.join(',') + ','; 		//将时间数组转换为字符串	,1235,1253,秒
            }
            else { t = ',' + (parseInt(arr[i].time.split(':')[0]) * 60 + Math.floor(arr[i].time.split(':')[1])) + ','; }

            if (t.indexOf(',' + Math.floor(cT + offSet) + ',') > -1) {
                for (j = 0; j < arr.length; j++) { arr[j].style.color = '#3399FF'; }
                sp = lrc_div.offsetTop - parseInt(lrc_div.offsetHeight / 2) + arr[i].offsetTop; 	//始终使歌词在正中，哈哈
                lrc_div.scrollTop = sp;
                arr[i].style.color = '#00FF00';
            }
        }
    }
};
/********************播放器控制********************/
GyyxMusicBoxWeb.MediaPlayControl = Class.create();
GyyxMusicBoxWeb.MediaPlayControl.prototype = {
    initialize: function(nowPlayCode) {//初始化
        this.MediaPlay = new GyyxMusicBoxWeb.MediaPlay("mediaPlay"); //初始化一个播放器
        if (MyMusicDataList[playMusicList.nowPlayListName] == null || MyMusicDataList[playMusicList.nowPlayListName].length <= 0) cookiesWork.getData(playMusicList.nowPlayListName); //如果当前播放中列表为空则去取数据
        this.nowPlayCode = nowPlayCode || 0;
        if (MyMusicDataList[playMusicList.nowPlayListName] != null && MyMusicDataList[playMusicList.nowPlayListName].length > 0) {
            this.MusicBoxCount = MyMusicDataList[playMusicList.nowPlayListName].length;
            this.NowMusicBoxList = MyMusicDataList[playMusicList.nowPlayListName];
        }
        else {
            this.MusicBoxCount = -1;
            this.NowMusicBoxList = null;
        }
        this.playMode = 1;
        this.MuteState = this.MediaPlay.getMuteState();
        this.PlayState = 0;
    },
    playNow: function(nowid) {//播放now
        var x = this.getMediaInfo(5);
        if (x == 3 && nowid == undefined) this.playPause(); //如果当前播放状态为3且NOWID没定义
        else if (nowid == undefined && this.getMediaInfo(5) > 0) {//如果不为3时调用 播放
            this.MediaPlay.play();
        } else {
            if (nowid == undefined)
                this.nowPlayCode = this.nowPlayCode;
            else if (nowid < 0)
                this.nowPlayCode = 0;
            else if (nowid >= this.MusicBoxCount)
            {this.nowPlayCode = this.nowPlayCode;}
            else
            {this.nowPlayCode = nowid;}
            this.MediaPlay.play(this.NowMusicBoxList[this.nowPlayCode].file);
            document.title = "光宇音乐盒  --  " + this.NowMusicBoxList[this.nowPlayCode].title + " " + this.NowMusicBoxList[this.nowPlayCode].singer;
            webui.RightNowPlayListUI(nowid); //改变右侧菜单
            //加载歌词
            if (this.NowMusicBoxList[this.nowPlayCode].lrc.length > 0) { musicLrc.xmlHttp(this.NowMusicBoxList[this.nowPlayCode].lrc); }
            musicLrcSid = setInterval("musicLrc.showLrc();", 500);
        }
        if (this.MuteState) this.playMute();
        this.PlayState = 1;

    },
    playPrv: function() {//播放上一个

        var nextCode = this.nowPlayCode;
        switch (this.playMode) {
            case 1:
                nextCode = nextCode - 1 < 0 ? this.MusicBoxCount - 1 : nextCode - 1;
                break;
            case 2:
                var Range = this.MusicBoxCount - 1 - 0;
                var Rand = Math.random();
                nextCode = 0 + Math.round(Rand * Range);
                break;
            case 3:
                nextCode = nextCode;
                break;

        }
        this.nowPlayCode = nextCode;
        this.playNow(nextCode);
    },
    playNext: function() {//播放下一个
        var nextCode = this.nowPlayCode;
        switch (this.playMode) {
            case 1:
                nextCode = nextCode + 1 >= this.MusicBoxCount ? 0 : nextCode + 1;
                break;
            case 2:
                var Range = this.MusicBoxCount - 1 - 0;
                var Rand = Math.random();
                nextCode = 0 + Math.round(Rand * Range);
                break;
            case 3:
                nextCode = nextCode;
                break;

        }
        this.nowPlayCode = nextCode;
        this.playNow(nextCode);
    },
    playStop: function() { //停止

        this.MediaPlay.stop();
        this.PlayState = 0;
    },
    playPause: function(value) {//暂停
        value ? this.MediaPlay.play() : this.MediaPlay.pause();
    },
    setVolume: function(volume) {
        this.MediaPlay.setVolume(volume);
    },
    getMediaInfo: function(value) {
        var rtSMG = "";
        if (value >= 1 && value <= 4) {
            rtSMG = this.MediaPlay.getMediaObjInfo(value);
        }
        else if (value == 5) {
            rtSMG = this.MediaPlay.getplayState();
        } else {
            try { rtSMG = this.NowMusicBoxList[this.nowPlayCode].title; }
            catch (e) { }
        }
        return rtSMG;
    },
    playMute: function() {
        this.MediaPlay.mute();
        this.MuteState = this.MediaPlay.getMuteState();
    },
    getMuteState: function() {
        return this.MuteState;
    }
};
/********************歌曲列表********************/
GyyxMusicBoxWeb.MusicList = Class.create();
GyyxMusicBoxWeb.MusicList.prototype = {
    initialize: function() {//初始化
        this.myMusicListStateShow = 1; //我的当前歌曲列表状态1本地状态2服务器状态
        this.myMusicListStatePlay = 1; //我当前播放的列表
        this.LoadMyMusicList();
        this.myServerMusicListName = new Array();
        this.nowPlayListName = this.myMusicListName[0]; //当前播放的列表名
        this.nowShowListName = this.myMusicListName[0]; //当前显示的列表
        if (MyMusicDataList[this.nowPlayListName] == undefined || MyMusicDataList[this.nowPlayListName] == null || MyMusicDataList[this.nowPlayListName].length <= 0) cookiesWork.getData(this.nowPlayListName);
        if (MyMusicDataList[this.nowPlayListName] != undefined && MyMusicDataList[this.nowPlayListName] != null && MyMusicDataList[this.nowPlayListName].length > 0) this.nowPlayMusic = MyMusicDataList[this.nowPlayListName][0]; //当前播放的歌曲信息
    },
    LoadMyMusicList: function() {//加载歌曲列表
        this.myMusicListName = cookiesWork.getMusicListName();
    },
    //    LoadMyMusicListToArray: function(value) {//加载歌曲列表明细
    //        if (this.myMusicListState == 1) {
    //            this.myMusicListName = cookiesWork.getMusicListName();
    //        }
    //    },
    AddMusicListName: function(arrayName) {//增加新的列表名
        //        var AddGroupLocationSelect = document.getElementsByName("AddGroupLocationSelect");
        //        for (i = 0; i < AddGroupLocationSelect.length; i++) {

        //            if (AddGroupLocationSelect[i].checked) {
        //                this.myMusicListStateShow = AddGroupLocationSelect[i].value;
        //            }
        //        }

        //        if (this.myMusicListStateShow == 1) {
        //            if (this.myMusicListName.indexOf(arrayName) >= 0) {
        //                alert("您的列表中已经有该列表了，请您改名");
        //                return false;
        //            }
        //            else {
        //                this.myMusicListName[this.myMusicListName.length] = arrayName;
        //                cookiesWork.addMusicListName(arrayName);
        //                webui.CreateMusicListNameUI();
        //                return true;
        //            }
        //        }
        if (userData.loginState == 1) {
            if (this.myServerMusicListName.indexOf(arrayName) >= 0) {
                alert("您的列表中已经有该列表了，请您改名");
                return false;
            }
            else {
                this.myServerMusicListName[this.myServerMusicListName.length] = arrayName;
                MyServerMusicDataList[arrayName] = new Array();
                webui.CreateMusicListNameUI();
                return true;
            }
        }
    },
    AddMusicToNowPlayList: function(code, file, lrc, title, singer, album, popularity, servercode) {//增加一首歌到当前显示的列表
        var tmp = new SingleMusicDataInfo(code, file, lrc, title, singer, album, popularity, servercode);
        if (this.myMusicListStateShow == 1) {
            cookiesWork.addData(this.nowShowListName, tmp);
        }
        else if (this.myMusicListStateShow == 2) {
            MyServerMusicDataList[this.nowShowListName][MyServerMusicDataList[this.nowShowListName].length] = tmp;
        }
        webui.RightNowPlayListUI(); //刷新右侧菜单
    },
    DelMusicToNowPlayList: function(code) {//从当前显示的列表删除一首歌code 要删除的编号
        if (code == mediaplay.nowPlayCode && playMusicList.nowPlayListName == this.nowShowListName && this.myMusicListStateShow == this.myMusicListStatePlay) {
            mediaplay.playStop();
        }
        if (this.myMusicListStateShow == 1) {
            cookiesWork.delData(this.nowShowListName, code);
        }
        else if (this.myMusicListStateShow == 2) {
            MyServerMusicDataList[this.nowShowListName][code] = null;
            MyServerMusicDataList[this.nowShowListName] = MyServerMusicDataList[this.nowShowListName].compact();
            for (var i = 0; i < MyServerMusicDataList[this.nowShowListName].length; i++) {
                MyServerMusicDataList[this.nowShowListName].code = i;
            }
        }
        webui.RightNowPlayListUI();
    },
    PlayNowShowMusic: function(code) {//播放现在现实的列表里的某首歌曲

        this.nowPlayListName = this.nowShowListName;
        this.myMusicListStatePlay = this.myMusicListStateShow;
        if (this.myMusicListStateShow == 1) {
            mediaplay.MusicBoxCount = MyMusicDataList[this.nowPlayListName].length;
            mediaplay.NowMusicBoxList = MyMusicDataList[this.nowPlayListName];
        }
        else if (this.myMusicListStateShow == 2) {
            mediaplay.MusicBoxCount = MyServerMusicDataList[this.nowPlayListName].length;
            mediaplay.NowMusicBoxList = MyServerMusicDataList[this.nowPlayListName];
        }
        mediaplay.playNow(code);
    },
    AddSystemMusicListToUserList: function(sourceList) {//从系统列表添加到用户列表
        if (userData.loginState == 0) {
            alert("请先登陆才可以添加自定义列表");
            return;
        }
        if (sourceList == undefined) sourceList = musicList.nowShowListName;
        if (this.myServerMusicListName.indexOf(sourceList.replace(/^[LS]/g, '')) >= 0) alert("您已经有该同名列表！");
        else {
            this.nowShowListName = sourceList.replace(/^[LS]/g, '');
            this.AddMusicListName(this.nowShowListName);
            //MyMusicDataList[this.nowShowListName] = SystemMusicDataList[sourceList].clone();
            for (var i = 0; i < SystemMusicDataList[sourceList].length; i++) {
                //cookiesWork.addData(this.nowShowListName, SystemMusicDataList[sourceList][i]);
                MyServerMusicDataList[this.nowShowListName][i] = SystemMusicDataList[sourceList][i];
            }
            $('playListNameSpan').innerHTML = this.nowShowListName;
            playMusicList.myMusicListStateShow = 2;
            webui.RightNowPlayListUI();
        }
    },
    GroupWorkEmpty: function(val) {//清空一个组名
        if (playMusicList.nowPlayListName == this.nowShowListName && this.myMusicListStateShow == this.myMusicListStatePlay) {
            mediaplay.playStop();
        }
        if (this.myMusicListStateShow == 1 && MyMusicDataList[this.nowShowListName] != null && MyMusicDataList[this.nowShowListName].length > 0) {
            MyMusicDataList[this.nowShowListName].clear();
            cookiesWork.SetCookie(this.nowShowListName, "");
        }
        else if (this.myMusicListStateShow == 2 && MyServerMusicDataList[this.nowShowListName] != null && MyServerMusicDataList[this.nowShowListName].length > 0) {
            MyServerMusicDataList[this.nowShowListName].clear();
        }
        if (isIE) setTimeout(CollectGarbage, 10); //IE专用，回收资源
        if (val == undefined) webui.RightNowPlayListUI();
    },
    GroupWorkDelete: function() {//删除一个列表
        if (this.nowShowListName == "默认列表") {
            alert("对不起默认列表不可以删除！");
            return;
        }
        this.GroupWorkEmpty(1);
        if (this.myMusicListStateShow == 1) {
            this.myMusicListName = this.myMusicListName.without(this.nowShowListName);
            cookiesWork.delMusicListName(this.nowShowListName);
        }
        else if (this.myMusicListStateShow == 2) {
            this.myServerMusicListName = this.myServerMusicListName.without(this.nowShowListName);
        }
        this.nowShowListName = "默认列表";
        this.myMusicListStateShow = 1;
        webui.RightNowPlayListUI();
    }
};
/********************用户数据********************/
GyyxMusicBoxWeb.UserData = Class.create();
GyyxMusicBoxWeb.UserData.prototype = {
    initialize: function() {
        this.serverCode = 0;
        this.username = ""; //用户名
        this.integral = 0; //积分
        this.loginState = 0; //登陆状态
        this.userDataSyncSid = 0;
        this.userLevelImg = ""; //用户等级 
    },
    SendUserGroupData: function() {//发送本地分组数据给后台
        var url = "AccountDataXml.aspx?KeyWord=SyncUserGroupList&timestamp=" + new Date().getTime();
        var userData = "userData=";
        var strUserGroup = new Array();
        try {
            for (var i = 0; i < playMusicList.myServerMusicListName.length; i++) {
                var tmpData = new Array();
                var tmpList = MyServerMusicDataList[playMusicList.myServerMusicListName[i]];
                for (var j = 0; j < tmpList.length; j++) {
                    tmpData[j] = tmpList[j].servercode;
                }
                strUserGroup[i] = playMusicList.myServerMusicListName[i] + "=" + tmpData.join(",");
            }
            userData += encodeURIComponent(strUserGroup.join("$"));
            new Ajax.Request(url, {
                method: 'post',
                parameters: userData
            });
        }
        catch (e) { }
    },
    bindUserGroupData: function() {//绑定用户服务器端用户分组数据
        if (this.loginState == 1) {
            var url = "AccountDataXml.aspx?KeyWord=GetUserGroupList&timestamp=" + new Date().getTime();
            new Ajax.Request(url, {
                method: 'get',
                onSuccess: function(xDom) {
                    var myDocument = new ActiveXObject("Microsoft.XMLDOM");
                    myDocument.loadXML(xDom.responseText);
                    var myRoot = myDocument.documentElement;
                    var dir = myRoot.getElementsByTagName("userData");
                    for (var i = 0; i < dir.length; i++) {
                        playMusicList.myServerMusicListName[i] = dir[i].getAttribute('groupName');
                        musicList.GetUserData(dir[i].getAttribute('groupName'), dir[i].getAttribute('groupMusicValue'), 4);
                    }
                } .bind(this)
            });

        }
    },
    bindUserXmlData: function(xDom) {//绑定从后台取来的用户数据
        var myDocument = new ActiveXObject("Microsoft.XMLDOM");
        myDocument.loadXML(xDom.responseText);
        var myRoot = myDocument.documentElement;
        var dir = myRoot.getElementsByTagName("user");
        if (dir != null && dir.length > 0 && dir[0].getAttribute('Name').length > 0) {
            this.username = dir[0].getAttribute('Name');
            this.serverCode = dir[0].getAttribute('Code');
            this.integral = dir[0].getAttribute('Integral');
            this.loginState = 1;
            this.userLevelImg = dir[0].getAttribute('Level');
            this.bindUserGroupData();
        }
    },
    login: function(username, password) {//登陆
        var url = "AccountDataXml.aspx?KeyWord=login&timestamp=" + new Date().getTime();
        var userData = "userName=" + encodeURIComponent(username) + "&passWord=" + encodeURIComponent(password);
        new Ajax.Request(url, {
            method: 'post',
            parameters: userData,
            onSuccess: this.bindUserXmlData.bind(this),
            onComplete: function() {
                if (this.loginState == 1) {
                    webui.UserLoginUI();
                    this.userDataSyncSid = setInterval("userData.syncCookiesToServer();", 5000);
                }
                else {
                    alert("用户名或密码错误！");
                }
            } .bind(this)
        });
    },
    logout: function() {//注销
        var url = "AccountDataXml.aspx?KeyWord=Logout&timestamp=" + new Date().getTime();
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: function(transport) {
                this.loginState = 0;
                this.serverCode = 0;
                this.username = "";
                this.integral = 0;
                webui.UserLogoutUI();
                clearInterval(this.userDataSyncSid);
            } .bind(this),
            onComplete: function() {
                if (playMusicList.myMusicListStatePlay == 2) {
                    playMusicList.myMusicListStatePlay = 1;
                    playMusicList.nowPlayListName = "默认列表";
                    mediaplay.playStop();
                }
                if (playMusicList.myMusicListStateShow == 2) {//如果用户当前打开的是服务器列表自动 切走
                    playMusicList.myMusicListStateShow = 1;
                    playMusicList.nowShowListName = "默认列表";
                    webui.RightNowPlayListUI();
                }
            } .bind(this)
        });
    },
    CheckLogin: function() {//调用后台检查用户是否已经登陆过
        var url = "AccountDataXml.aspx?KeyWord=CheckLogin&timestamp=" + new Date().getTime();
        new Ajax.Request(url, {
            method: 'get',
            onSuccess: this.bindUserXmlData.bind(this),
            onComplete: function() {
                if (this.loginState == 1) {
                    webui.UserLoginUI();
                    this.userDataSyncSid = setInterval("userData.syncCookiesToServer();", 5000);
                }
                else {
                    webui.UserLogoutUI();
                }
            } .bind(this)
        });
    },
    syncCookiesToServer: function() {//定时程序每30秒一次同步本地数据到服务器
        this.SendUserGroupData();
    }
};



/********************全局变量********************/
//页面DIV的ID

var nowPlayList = $("nowPlayList"); //当前播放列表

var lrc_div = $("lrc"); //歌词

//公共对象
var isIE = /msie/i.test(navigator.userAgent) && window.ActiveXObject;//测试当前浏览器


var SystemMusicDataList = new Array(); //歌曲列表缓存
var MyMusicDataList = new Array(); //我在本地的歌曲列表
var MyServerMusicDataList = new Array(); //我在服务器的歌曲列表
var MusicDataList = new Array(); //成生歌曲总列表
MusicDataList["SystemMusicDataList"] = SystemMusicDataList;
MusicDataList["MyServerMusicDataList"] = MyServerMusicDataList;
MusicDataList["MyMusicDataList"] = MyMusicDataList;

var musicList = new GyyxMusicBoxWeb.MusicDataListXml(); //JS缓存

var cookiesWork = new GyyxMusicBoxWeb.MusicDateListCookie(); //cookies操作对象

var playMusicList = new GyyxMusicBoxWeb.MusicList();//歌曲列表操作类

var mediaplay = new GyyxMusicBoxWeb.MediaPlayControl(0); //播放器控制对象

var musicLrc = new GyyxMusicBoxWeb.MusicLrcWord();

var userData = new GyyxMusicBoxWeb.UserData();//用户



var musicLrcSid; //歌词休眠ID
var offSet = 0; //offset余补时间
/********************页面初始化********************/



var webui = new GyyxMusicBoxWeb.WebUI();
webui.RightNowPlayListUI();

webui.BindCentenMenu("L每日推荐",-1,1);

function _setVolume(value) {
    mediaplay.setVolume(value);
}


var soundSlider = new Control.Slider('soundhandle', 'soundtrack', {
    range: $R(0, 100),
    sliderValue: 50,
    onSlide: _setVolume.bind(this),
    onChange: _setVolume.bind(this)
});
var playSlider = new Control.Slider('playhandle', 'playtrack', {
    range: $R(0, 1),
    sliderValue: 0,
    onSlide: playTimeSlideHandler.bind(this),
    onChange: playTimeChangeHandler.bind(this)
});


function playTimeSlideHandler(value) {
}

function playTimeChangeHandler(value) {
}


var sid = setInterval("webui.RefurbishUI();", 1000);


userData.CheckLogin();//检查用户是否已经登陆

/********************页面事件********************/
window.onresize = function() { webui.WindowMakeSize(); };
webui.WebTop2UI(1);
/********************页面事件********************/
objTDR.UpdateHeaderMenu(1);
objTDR.UpdateBodyMenu(1, 'lmenu1', 'lmusic1');
objTDR.UpdateBodyMenu(3, 'rmenu1', 'rmusic1');
objTDR.UpdateBodyMenu(5, 'lmenu2', 'lmusic2');
objTDR.UpdateBodyMenu(7, 'rmenu2', 'rmusic2');
objTDR.UpdateBodyMenu(9, 'lmenu3', 'lmusic3');
objTDR.UpdateBodyMenu(11, 'rmenu3', 'rmusic3');



var exteriorValue = 0;
if (location.search.length == 2) {
    exteriorValue = location.search.substring(1);
}

if (exteriorValue == 1) {

    var fatherMusicList = (window.opener && window.opener.musicObj) ? window.opener.musicObj.getToPlayMusic() : null;
    if (fatherMusicList != null && fatherMusicList.length > 0) {
        for (var i = 0; i < fatherMusicList.length; i++) {
            playMusicList.AddMusicToNowPlayList(0, fatherMusicList[i].file, fatherMusicList[i].lrc, fatherMusicList[i].title, fatherMusicList[i].singer, fatherMusicList[i].album, fatherMusicList[i].popularity, fatherMusicList[i].servercode);
        }
    }

}

if (exteriorValue == 2) {
    var spInfo = (window.opener && window.opener.musicObj) ? window.opener.musicObj.getToPlayMusic() : null;
    webui.BindCentenMenu(spInfo[0].name, -1, spInfo[0].code);
}

function appendMusicList(music) {
    for (var i = 0; i < music.length; i++) {
            playMusicList.AddMusicToNowPlayList(0, music[i].file, music[i].lrc, music[i].title, music[i].singer, music[i].album, music[i].popularity, music[i].servercode);
        }
    }

function appendSpecialList(spInfo) {
    webui.BindCentenMenu(spInfo[0].name, -1, spInfo[0].code);
}