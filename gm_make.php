#!/usr/bin/php
<?php
/**
 * This script builds the GreaseMonkey version of the plugin
 */
if ('cli' != php_sapi_name()) die();

require("../../../inc/init.php");
require("../../../inc/JSON.php");

unset($lang);
include("lang/en/lang.php");

$json   = new JSON();
$header = file_get_contents('gm_head.js');
$main   = file_get_contents('toolbox.js');
$langs  = 'var toolbox_lang = '.$json->encode($lang['js']).";\n";

$fh = fopen('gm_toolbox.js','w');
fwrite($fh,$header);
fwrite($fh,$langs);
fwrite($fh,$main);
fclose($fh);

//system('cp gm_toolbox.js /home/andi/.mozilla/firefox/l2pmnd3t.default/gm_scripts/dokuwiki_toolbox/dokuwiki_toolbox.user.js');
