#!/usr/bin/php
<?php
/**
 * This script builds the chrome version of the plugin
 */
if('cli' != php_sapi_name()) die();

require("../../../inc/init.php");

// build script
{
    // open output
    $fh = fopen(__DIR__ . '/chrome/script.js', 'w');

    // load the language files
    unset($lang);
    /** @var array $lang */
    include("lang/en/lang.php");
    fwrite($fh, 'var toolbox_lang = ' . json_encode($lang['js']) . ";\n");

    // set the icon base
    fwrite($fh, "var toolbox_icon = '//github.com/splitbrain/dokuwiki-plugin-toolbox/raw/master/pix/';\n");

    // add the scripts
    foreach(array('ToolboxFindAndReplace.js', 'toolbox.js') as $script) {
        fwrite($fh, file_get_contents($script));
    }

    // reinitialize the toolbar
    fwrite($fh, "var tb = document.getElementById('toolbox__picker');");
    fwrite($fh, "if(!tb) initToolbar('tool__bar','wiki__text',toolbar);");

    // close output
    fclose($fh);
}

// set version in manifest
{
    $info = confToHash(__DIR__ . '/plugin.info.txt');
    $manifest = __DIR__ . '/chrome/manifest.json';
    $m = json_decode(file_get_contents($manifest));
    $m->version = str_replace('-', '.', $info['date']);
    file_put_contents($manifest, json_encode($m, JSON_PRETTY_PRINT));
}
