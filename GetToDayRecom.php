<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
    require_once 'config.php';
    require_once 'include/db_class.php';
    require_once 'include/function.php';
    $DB = new MySqlClass(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);
    function GetSpecialData($DB,$signValue)
    {
        $sql = "select b.create_date, b.code,special_name,b.search_count,b.song_count,b.img_url,b.note,c.chansonnier_name from mb_page_special_value as a join mb_special_tb as b on a.special_id=b.code join mb_chansonnier_tb as c on b.chansonnier_code=c.code WHERE a.special_type_id=$signValue";
        $result=$DB->ExeSql($sql);
        $xmlstr="";
        while($row=$DB->getRowResult($result))
        {
            $code=$row['code'];
            $special_name=$row['special_name'];
            $img_url = $row['img_url'];
            $note = $row['note'];
            $chansonnier_name = $row['chansonnier_name'];
            $create_date = $row['create_date'];
            $xmlstr = "$xmlstr<specialinfo spCode=\"$code\" spName=\"$special_name\" imgUrl=\"$img_url\" note=\"$note\" chanName=\"$chansonnier_name\" createDate=\"$create_date\" />\n";
        }
        return MakeXmlFile($xmlstr);
    }
    function GetMusicData($DB,$signValue)
    {
        $sql = "select b.code,song_name,b.img_url,b.music_url,b.lrc_url,c.chansonnier_name ,b.collect_count,d.special_name,d.img_url as music_img_url from mb_page_recommend_value as a join mb_song_index_tb as b on a.song_id=b.code join mb_chansonnier_tb as c on b.chansonnier_code=c.code join mb_special_tb as d on b.special_code=d.code WHERE a.recommend_type_id=$signValue";
        $result=$DB->ExeSql($sql);
        $xmlstr="";
        while($row=$DB->getRowResult($result))
        {
            $music_url=$row['music_url'];
            $song_name=$row['song_name'];
            $chansonnier_name = $row['chansonnier_name'];
            $lrc_url = $row['lrc_url'];
            $special_name = $row['special_name'];
            $code = $row['code'];
            $music_img_url = $row['music_img_url'];
            $xmlstr = "$xmlstr<item file=\"http://mp3resource.guohai.org/$music_url\" title=\"$song_name\" singer=\"$chansonnier_name\" lrc=\"$lrc_url\" album=\"$special_name\" popularity=\"5\" serverid=\"$code\" imgUrl=\"$music_img_url\" />\n";
        }
        return MakeXmlFile($xmlstr);
    }
    $keyWord = $_GET['keyWord'];
    $signValue = $_GET['signValue'];
    switch ($keyWord)
    {
        case "special":
            echo GetSpecialData($DB,$signValue);
            break;
        case "music":
            echo GetMusicData($DB,$signValue);
            break;
    }
?>
