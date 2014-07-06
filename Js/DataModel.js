/*
*项　目　名：光宇音乐盒,Model
*版　　本　：0.0.1
*作　　者　：H! Guo
*创建时间　：2009-07-22
*最后修改时间：2009-07-22
*/
/********************数据类Model********************/

SingleMusicDataInfo = Class.create();
SingleMusicDataInfo.prototype = {
    initialize: function(code, file, lrc, title, singer, album, popularity, servercode) {//初始化
        this.code = code || 0; //歌曲服务器编号
        this.file = file || ""; //MP3地址
        this.lrc = lrc || ""; //歌词地址
        this.title = title || ""; //歌曲标题
        this.singer = singer || ""; //歌手
        this.album = album || ""; //专辑
        this.popularity = popularity || 0; //人气
        this.servercode = servercode || 0; //服务器编号
    },
    inspect: function() {//返回对象的字符串表示
        return this.file + "," + this.lrc + "," + this.title + "," + this.singer + "," + this.album + "," + this.popularity;
    }
}