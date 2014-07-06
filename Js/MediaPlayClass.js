/*
*播放器
*版本：0.0.1
*作者：H! Guo
*时间：2009-06-16
*备注：使用了Prototype1.5[www.prototypejs.org]以上框架
*/
/********************开始********************/
if (GyyxMusicBoxWeb == undefined) { var GyyxMusicBoxWeb = {}; }
 
GyyxMusicBoxWeb.MediaPlay = Class.create();

GyyxMusicBoxWeb.MediaPlay.prototype = {

    initialize: function(objId) {//初始化
        this.objId = objId; //MP的ID
        this.Buffering = true; //当前MP是否在缓存

        this.playMode = 1; //播放模式1顺序循环，2随机，3单曲循环
        this.musicObject = document.createElement('object'); //创建播放器对象
        this.musicObject.id = this.objId;
        $('mpl').appendChild(this.musicObject);
        this.musicObject.classid = "clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6";
        if (this.musicObject.settings != undefined) {
            this.musicObject.settings.invokeURLs = false;
            this.musicObject.width = "645px";
            this.musicObject.height = "402px";
            this.musicObject.settings.playCount = 1;
            this.musicObject.settings.autoStart = false;
            this.musicObject.enableContextMenu = false;
            this.musicObject.uiMode = "none";
            this.musicObject.attachEvent('PlayStateChange', this._playStateChange.bind(this));
            this.musicObject.attachEvent('OpenStateChange', this._openStateChange.bind(this));
            this.musicObject.attachEvent('Buffering', function(value) { this.Buffering = value; });
            if (this.musicObject.versionInfo) {
                var tmpIndex = this.musicObject.versionInfo.indexOf(".");
                var majorVersion = this.musicObject.versionInfo.substr(0, tmpIndex > 0 ? tmpIndex : this.musicObject.versionInfo.length);
                if (parseInt(majorVersion) >= 7) {
                    this.versionValid = true;
                    this.success = true;
                }
            }
        }

    },
    _playStateChange: function(value) { if (value == 8) ("_playStateChange" + value); },
    _openStateChange: function(value) { //alert("_openStateChange" + value); 
    },
    play: function(url) {//播放
        if (url == undefined && this.musicObject.URL.length <= 0)
            return;

        if (url == undefined && this.musicObject.URL != null && this.musicObject.URL.length > 0) {
            this.musicObject.controls.play();
        } else if (url.length > 0) {
            this.musicObject.URL = url;
            this.musicObject.controls.play();
        }
        else {
            if (this.musicObject.URL.length > 0) {
                this.musicObject.controls.play();
            }
        }
    },
    stop: function() {//停止
        this.musicObject.controls.stop();
    },
    pause: function() {//暂停
        this.musicObject.controls.pause();
    },
    mute: function() {

        var valtmp = this.musicObject.settings.mute ? false : true;
        this.musicObject.settings.mute = valtmp;
    },
    getMuteState: function() {

        return this.musicObject.settings.mute;
    },
    setVolume: function(volume) {//设置音量

        if (volume < 0)
            volume = 0;
        if (volume > 100)
            volume = 100;
        this.musicObject.settings.volume = volume;
    },
    getMediaObjInfo: function(value) {//取媒体文件信息，1当前时间秒，2当前时间分，3总时间秒，4总时间分

        var time = 0;
        try {
            if (this.musicObject.URL.length > 0) {
                switch (value) {
                    case 1: time = this.musicObject.controls.currentPosition;
                        break;
                    case 2: time = this.musicObject.controls.currentPositionString;
                        break;
                    case 3: time = this.musicObject.currentMedia.duration;
                        break;
                    case 4: time = this.musicObject.currentMedia.durationString;
                        break;
                }

            }
        }
        catch (e) { time = 0; }
        return time;
    },
    setMediaObjPosition: function(position) {//设置文件播放点，参数为小数
        if (position < 0) position = 0;
        if (position > 1) position = 1;
        this.musicObject.controls.currentPosition = position * this.musicObject.currentMedia.duration;
    },
    getplayState: function() {//播放状态，1=停止，2=暂停，3=播放，6=正在缓冲，9=正在连接，10=准备就绪
        return this.musicObject.playState;
    }
}