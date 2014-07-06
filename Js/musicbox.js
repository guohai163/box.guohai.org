/*
*歌曲播放JS脚本
*2009-6-9
*By:H! Guo
*/

/***************************初始化******************/
var count=0;	//当前播放的歌曲
var maxCount=0;//当前列表总歌曲
var offSet=0;	//offset余补时间
var newmusic="newmusic.xml"; //新
var hotmusic="hotmusic.xml";
var nonceList="newmusic.xml";
var _controlData = new ControlData();
_controlData.currHitMenu[0]=1;//初始化菜单状态
var playingImg=document.createElement("span");
playingImg.className="playbtn";

/********************创建页面对象 ************************/
var musicListDiv = $("musicListDiv");
var lyricInfo = $("lyricInfo");
var MPlayer = $("MediaPlayer");
var lrc_div=$("lrc_div");
var infobar=$("infobar");
var debugmsg=$("debugmsg");


abc=function(){debugmsg.innerHTML=count+"";}
var cookieobj = new CookieClass();
isIE = /msie/i.test(navigator.userAgent) && window.ActiveXObject;
if(!isIE){alert('本播放器只支持IE，\n要想听到美妙的音乐，\n请用IE浏览器，\n且支持控件！')};

var nowPlayInfo = function(){this.file="";this.lrc="";this.title="";this.singer="";}
/**********改变窗框大小 ***********/
window.onload=function(){resize();}
function resize(){window.resizeTo(820,700);}

xmlDom(nonceList,echo_list);//加载第一首歌

function ControlData(){this.currHitMenu=[0,0];this.currHitSong=0;this.currPlayMenu=[0,0];this.currPlaySong=0;}


/********************************系统调用函数***********************/
function $(name)		//取得对象
{
	if (document.getElementById){return document.getElementById(name);}
	else if(document.all){return document.all[name];}
	else{return null;}
};


        
function xmlDom(file,handle)	//创建xmldom,返回xmldom对象,	handle(xmldom)
{
    var XMLDom=null;
    var MS_XML_DOM = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0","MSXML2.DOMDocument.3.0","MSXML2.DOMDocument","Microsoft.XmlDom"];
    if (isIE)//试用XML文档对象
    {for (var i=0; i<MS_XML_DOM.length; i++)
        {try{XMLDom = new ActiveXObject(MS_XML_DOM[i]);break;} catch (e){}}
    }
    else XMLDom = document.implementation.createDocument("", "", null);
    XMLDom.async = false;
    XMLDom.preserveWhiteSpace=true;//兼容FireFox
    
    try{
    if (isIE) XMLDom.onreadystatechange = function (){if(XMLDom.readyState == 4) handle(XMLDom);}
    else XMLDom.onload = function () {handle(XMLDom); }
    XMLDom.load(file);
    }catch(e){}
}

function echo_list(xDom)	//将读取的xml输出到层
{
    var dir = xDom.getElementsByTagName("item");	//(item)子目录集合

    var tmp="<table id='musicListTable'>\r\n";
    tmp+="<tbody><tr><th class='songname'>歌名</th><th class='singer'>歌手</th><th>收藏</th></tr></tbody>\r\n";
    for(var i=0;i<dir.length;i++)
    {
        var tmpid="";
        if(i==count){tmpid="playing";nowPlayInfo.file=dir[i].getAttribute('file');nowPlayInfo.lrc=dir[i].getAttribute('lrc');nowPlayInfo.title=dir[i].getAttribute('title');nowPlayInfo.singer=dir[i].getAttribute('singer');}
        else{tmpid="songTR";}
    tmp+="<tbody id='tbody"+i+"'><tr id='"+tmpid+"'><td class='songname'><a href='javascript:void(null);' onclick='setpalymusic("+i+",\""+dir[i].getAttribute('file')+"\",\""+dir[i].getAttribute('lrc')+"\",\""+dir[i].getAttribute('title')+"\",\""+dir[i].getAttribute('singer')+"\")' ><span class='ready'></span>"+dir[i].getAttribute('title')+"</a></td><td class='singer'>"+dir[i].getAttribute('singer')+"</td><td><a class='collect' herf='#'></a></td></tr></tbody>\r\n";}
     tmp+="</table>\r\n";
    musicListDiv.innerHTML=tmp;
    palysinglemusic(nowPlayInfo.file,nowPlayInfo.lrc,nowPlayInfo.title,nowPlayInfo.singer);//加载第一首歌
}

//function playSong(add)//播放歌曲
//{

//}

function xmlHttp(file,handle)	//创建xmlhttp对象handle(str)
{
    var xmlhttp=null;
    var str='';
    var MS_XML_HTTP =["Msxml5.XMLHTTP","Msxml4.XMLHTTP","Msxml3.XMLHTTP","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
    if (isIE)
	{for (var i=0; i<MS_XML_HTTP.length; i++)
		{try{xmlhttp = new ActiveXObject(MS_XML_HTTP[i]);break;}catch (e){}
		}
	}
    else xmlhttp=new XMLHttpRequest();
    try{xmlhttp.open("GET",file,false);
	 if (isIE)
		{xmlhttp.onreadystatechange=function()
			{if(xmlhttp.readyState==4){handle(tochinese(xmlhttp));}
			}
		}
	 else xmlhttp.onload = function(){handle(tochinese(xmlhttp));}
	 xmlhttp.send(null);
	}catch(e){lyricInfo.innerHTML='歌词地址有错，不能载入！';}
}

function tochinese(x)	//xhttp编码输出中文,(by:Rimifon)
{try{	//最好是将歌词utf-8编码就不需要此函数转化了
	var Rec=new ActiveXObject("ADODB.RecordSet");
	Rec.Fields.Append("DDD",201,1);
	Rec.Open();	Rec.AddNew();
	Rec(0).AppendChunk(x.responseBody);
	Rec.Update();var HTML=Rec(0).Value;
	Rec.Close();delete Rec;
	return HTML;
	}
	catch(e){return x.responseText;}
};
function echo_lrc(str)	//将歌词字符输出
{if(/\[offset\:(\-?\d+)\]/i.test(str))		//取offset余补时间
 offSet= RegExp.$1/1000;
 str=str.replace(/^\[ti\:([^\]]*)\]\r/mg,'<div style="color:#FF6600;over-flow:hidden;">歌曲:《$1》</div>')
 str=str.replace(/^\[ar\:([^\]]*)\]\r/mg,'<div style="color:#FF6600;over-flow:hidden;">演唱者:$1</div>')
 str=str.replace(/^\[al\:([^\]]*)\]\r/mg,'<div style="color:#FF6600;over-flow:hidden;">专集:$1</div>')
 str=str.replace(/^\[by\:([^\]]*)\]\r/mg,'<div style="color:#FF6600;over-flow:hidden;">制作:$1</div>')
 str=str.replace(/\[\:\][^$\n]*(\n|$)/g,"$1")
 str=str.replace(/\]\[/g,'|')
 str=str.replace(/^\[([\d\:\.\|]+)\]([^\r]*)\s*$/mg,'<div id="_time" style="cursor:hand;" onclick="control_lrc(this.time)" time="$1">$2</div>')
 str=str.replace(/\[[\w-:]*\]\s*/g,'')
 str=str.replace(/(\r\n\s*){2,}/g,'<br\/>')
 lrc_div.innerHTML=str
}

function showLrc()			//进度控制歌词
{
	var cT=MPlayer.CurrentPosition;	//当前秒
	var aT=MPlayer.duration;	//总秒数
	var arr=document.getElementsByName("_time");
	var i,j,k=0,sp,tArr=[],t='';
	for(i=0;i<arr.length;i++)
	{
		if(/\|/g.test(arr[i].time))	//相同歌词有很多时间00:12.22|12:12.58
		{
			tArr=arr[i].time.split("|")
			for(k=0;k<tArr.length;k++)
			{tArr[k]=parseInt(tArr[k].split(':')[0])*60+Math.floor(tArr[k].split(':')[1]);}
			t=','+tArr.join(',')+',';			//将时间数组转换为字符串	,1235,1253,秒
		}
	 	else{t=','+(parseInt(arr[i].time.split(':')[0])*60+Math.floor(arr[i].time.split(':')[1]))+',';}
	 	
	 	if(t.indexOf(','+Math.floor(cT+offSet)+',')>-1)
		{	for(j=0;j<arr.length;j++){arr[j].style.color='#3399FF';}
			sp=lrc_div.offsetTop-parseInt(lrc_div.offsetHeight/2)+arr[i].offsetTop;		//始终使歌词在正中，哈哈
			lrc_div.scrollTop=sp;
			arr[i].style.color='#00FF00';
		}
	}
	if(aT>1 && Math.ceil(cT)>=parseInt(aT)){palyNextMusic();}
}

function palysinglemusic(mp3url,lrcurl,title,singer)
{
	MPlayer.FileName=mp3url;
	lyricInfo.scrollTop=0;
  	lyricInfo.innerHTML='歌词载入中...';
	if(lrcurl!='null')   {xmlHttp(lrcurl,echo_lrc);lyricInfo.innerHTML="<a href='"+lrcurl+"'>下载歌词</a>"; }
	else{lyricInfo.innerHTML='没有找到歌词...';}
	
	infobar.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;"+title+" - "+singer;
	ModifyTitle(title);
	checkNewValue(mp3url,lrcurl,title,singer);//增加历史
	sid=setInterval("showLrc()",500);
	setTimeout("MPlayer.Play()",100);
	setTimeout("if(MPlayer.PlayState==10 || MPlayer.PlayState==0)palyNextMusic();",2000);	//如果播放错误播放下一首歌
}

function control_lrc(time)			//歌词控制进度
{
    time=time.replace(/^[\s\S]*\|/,'');
    var t=parseInt(time.split(':')[0])*60+parseInt(time.split(':')[1]);
    if(/^\d+$/.test(t)){MPlayer.CurrentPosition=t-offSet;}
}
/********************************取XML文件用函数***********************/

function setpalymusic(id,mp3url,lrcurl,title,singer)
{
	count=id;
//	if(_controlData.currHitMenu[0]==1)
//	{
//	    xmlDom(nonceList,echo_list);
//	}
	//palysinglemusic(mp3url,lrcurl,title,singer);
	if(_controlData.currHitMenu[0]==1)
    xmlDom(nonceList,echo_list);
    else if(_controlData.currHitMenu[0]==0)
    palysinglemusic(mp3url,lrcurl,title,singer);
}

function palyNextMusic()
{
    if(_controlData.currHitMenu[0]==1)
    {
        count=count+1;
        xmlDom(nonceList,echo_list);
    }
    else if(_controlData.currHitMenu[0]==0)
    {
        getMusicBoxList(_controlData.currHitMenu[1]);
    }
}


 /******************改变左侧菜单*************************/
 function switchMenu()
{
var tmp="";
	var menu=document.getElementsByName("menu");
	for(i=0;i<menu.length;i++){
	
		if(menu[i].l_1==_controlData.currHitMenu[0]&&menu[i].l_2==_controlData.currHitMenu[1]){
			text=menu[i].getElementsByTagName("a");
				if(text.length>0)
					menu[i].innerHTML=text[0].innerHTML;menu[i].setAttribute("className","menucurrent");
		}else{
			a=menu[i].getElementsByTagName("a");
				if(a.length==0)
				{
					text=menu[i].childNodes[0];

					menu[i].innerHTML="<a href=javascript:void(null); onclick=\"changeMenuHit("+menu[i].l_1+","+menu[i].l_2+");return false;\">"+text.nodeValue+"</a>";
				}
				menu[i].className="";
}
if(menu[i].l_1==_controlData.currPlayMenu[0] && menu[i].l_2==_controlData.currPlayMenu[1])
	{
	imgs=menu[i].getElementsByTagName("img");
		if(imgs.length==0)
			{
			a=menu[i].getElementsByTagName("a")[0];
				if(a!=null)
					{
					a.appendChild(playingImg);
						}else{
							menu[i].appendChild(playingImg);
								}
			}
	}else{
									a=menu[i].getElementsByTagName("a")[0];
										if(a!=null)
										{
											imgs=a.getElementsByTagName("img");
											for(n=0;n<imgs.length;n++){if(imgs[n].title=="当前播放")a.removeChild(imgs[n]);}
										}
									}
	}
}



 function changeMenuHit(l_1,l_2){
    _controlData.currHitMenu[0]=l_1;
    _controlData.currHitMenu[1]=l_2;
    switchMenu();
    if(l_1==1){nonceList=l_2==0?newmusic:hotmusic;xmlDom(nonceList,echo_list);}
    if(l_1==0){getMusicBoxList(l_2);}
    if(l_1==2){collectionMusic();}
    //drawMusicList();
}

/****************COOKIE操作**********************/

function CookieClass()
{
	CookieClass.prototype.SetCookie = function(name,value)//两个参数，一个是cookie的名子，一个是值
	{
	    var Days = 365; //此 cookie 将被保存 30 天
	    var exp  = new Date();    //new Date("December 31, 9998");
	    exp.setTime(exp.getTime() + Days*24*60*60*1000);
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}
	
	CookieClass.prototype.GetCookie = function(name)//取cookies函数        
	{
	    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	     if(arr != null) return unescape(arr[2]); return null;

	}
	
	CookieClass.prototype.DelCookie = function(name)//删除cookie
	{
	    var exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    var cval=CookieClass.prototype.GetCookie(name);
	    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}
}


//历史相关的操作
function getMusicBoxListLength()
{
    return cookieobj.GetCookie("GyyxMusicBoxHistory").split(";").length-1;
}

function getMusicBoxList(x)//取历史 
{
        var tmp="<table id='musicListTable'>\r\n";
        tmp+="<tbody><tr><th class='songname'>歌名</th><th class='singer'>歌手</th><th>删除</th><th>收藏</th></tr></tbody>\r\n";
    if(x==0)
    {

    }
    else
    {

        var tmpcook=cookieobj.GetCookie("GyyxMusicBoxHistory");
        if(tmpcook){
            var temp = tmpcook.split(";");

            for(var i=temp.length-1-1;i>=0;i--)
            {
	            var nctmp = temp[i].split(",");
    	        tmp+="<tbody id='tbody"+i+"'><tr id='songTR'><td class='songname'><a href=\"javascript:void(null);\" onclick=\"setpalymusic("+i+",'"+nctmp[0]+"','"+nctmp[1]+"','"+nctmp[2]+"','"+nctmp[3]+"');\" ><span class=\"ready\"></span>"+nctmp[2]+"</a></td><td class=\"singer\">"+nctmp[3]+"</td><td><a class=\"del\"  href=\"javascript:void(null);\" onclick=\"delMusicBoxSong('"+nctmp[0]+"');\"></a></td><td><a class='collect' herf='#'></a></td></tr></tbody>\r\n";
            }
        }


    }
    tmp+="</table>";
    musicListDiv.innerHTML=tmp;
}

function addMusicBoxList(newCookieValue)
{
    tmp=cookieobj.GetCookie("GyyxMusicBoxHistory")==null?newCookieValue:cookieobj.GetCookie("GyyxMusicBoxHistory")+newCookieValue;
    cookieobj.SetCookie("GyyxMusicBoxHistory",tmp);
}

function checkNewValue(file,lrcurl,title,singer)
{
    var tmpcook=cookieobj.GetCookie("GyyxMusicBoxHistory");
    if(!tmpcook){addMusicBoxList(file+","+lrcurl+","+title+","+singer+";");return ;}
    var temp = tmpcook.split(";");
    var sign=0;
    for(var i=0;i<temp.length-1;i++)
    {
        if(file==temp[i].split(",")[0])
        {
            sign=1;
            break;
        }
    }
    if(sign==0){addMusicBoxList(file+","+lrcurl+","+title+","+singer+";");}
}
function cleanMusicBoxList()
{
    cookieobj.DelCookie("GyyxMusicBoxHistory");
    getMusicBoxList(_controlData.currHitMenu[1]);
}

function delMusicBoxSong(file)
{
    //debugger;
    var tmpcookie = cookieobj.GetCookie("GyyxMusicBoxHistory");
    if(!tmpcookie)return;
    var tmp = tmpcookie.split(";");
    var newtmp="";
    for(var i=0;i<tmp.length-1;i++)
    {
        if(file!=tmp[i].split(",")[0]){newtmp+=tmp[i]+";";}
    }
    cookieobj.SetCookie("GyyxMusicBoxHistory",newtmp);
    getMusicBoxList(_controlData.currHitMenu[1]);
}

//收藏 

function collectionMusic()
{
    musicListDiv.innerHTML='<div class="tipwin" style="position:static;margin-top:50px;margin-left:45px;"><h3><span><a href="javascript:void(null);" onclick="hideDefMyboxHint();return false;"><img src="/images/fav/close.gif" alt="关闭" width="8" height="8" border="0"></a></span>小提示</h3><div class="tip"><br/><br/>该功能暂未开放！<br/><br/><br/><br/><input type="button" class="closebtn" value="关闭" onclick="hideDefMyboxHint();return false;"></div></div>';
}
function hideDefMyboxHint()
{div=document.getElementById("musicListDiv");div.innerHTML="";}



function ModifyTitle(newTitle)//修改IE标题栏
{
    document.title="光宇音乐盒 - "+newTitle;
}