<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
    function MakeXmlFile($xmlData)
    {
        $strXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n<PageDataInfos>\n$xmlData\n</PageDataInfos>";
        return $strXml;
    }
?>
