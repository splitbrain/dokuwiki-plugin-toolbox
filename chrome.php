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

$fh = fopen('gm_toolbox.user.js','w');
fwrite($fh,$header);
fwrite($fh,$langs);
fwrite($fh,$main);
fclose($fh);

