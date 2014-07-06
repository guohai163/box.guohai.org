
if (GyyxWebUI == undefined) {
    var GyyxWebUI = {};
}
var sign = true;
GyyxWebUI.MenuClass = {//菜单右侧隐藏或显示
    MenuHideDiv: function(){
        if (sign) {
            $("rightDiv").hide();
            $("rightIndent").addClassName('mrwxx');
            $("allRightIndent").addClassName('mlwconn');
            $("gamePageData").addClassName('mlwconn');
        }
        else {
            $("rightDiv").show();
            $("rightIndent").removeClassName('mrwxx');
            $("rightIndent").addClassName('mrwx');
            $("allRightIndent").removeClassName('mlwconn');
            $("gamePageData").removeClassName('mlwconn');
            $("allRightIndent").addClassName('mlwcon');
            $("gamePageData").addClassName('mlwcon');
        }
        sign = !sign;
    }, //菜单隐匿或显示
    MenuPucker: function(obj, type){
        if (isNaN(type)) {
            return;
        }
        switch (type) {
            case 0:
                this.MenuOne(obj);
                break;
            case 1:
                this.MenuTwo(obj);
                break;
            case 2:
                this.MenuTwos(obj);
                break;
        }
    },
    MenuOne: function(obj){
        var temp = $("subMenu" + obj);
        if (temp.style.display == 'none') {
            this.MenuHide();
            temp.style.display = '';
        }
        else {
            temp.style.display = 'none';
        }
    },
    MenuHide: function(){
        var temp;
        for (var i = 1; i <= 4; i++) {
            temp = $("subMenu" + i);
            temp.style.display = 'none';
        }
    },
    MenuTwo: function(obj){
        var temp1 = $("musicName" + obj);
        if (temp1.style.display == 'none') {
            $("twoMenu" + obj).removeClassName('open');
            $("twoMenu" + obj).addClassName('close');
            temp1.style.display = '';
        }
        else {
            $("twoMenu" + obj).addClassName('open');
            temp1.style.display = 'none'
        }
    },
    MenuTwos: function(obj){
        var temp1 = $("musicSpecial" + obj);
        if (temp1.style.display == 'none') {
            $("twoMenus" + obj).removeClassName('open');
            $("twoMenus" + obj).addClassName('close');
            temp1.style.display = '';
        }
        else {
            $("twoMenus" + obj).addClassName('open');
            temp1.style.display = 'none'
        }
    }
    ,
    Test1: function(typeId,imgId){
        if (isNaN(typeId)||isNaN(imgId)) {return;}
        switch (typeId) {
            case -1:
                $("imgMusic" + imgId).src = "Images/imgsm.gif";
                break;
            case 0:
                $("imgMusic" + imgId).src = "Images/c.gif";
                break;
            case 1:
                $("imgMusic" + imgId).src = "Images/m.gif";
                break;
            case 2:
                $("imgMusic" + imgId).src = "Images/e.gif";
                break;        
        }
    }
}
