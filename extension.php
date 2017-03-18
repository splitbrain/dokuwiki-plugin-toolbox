#!/usr/bin/php
<?php
/**
 * This script builds the extension version of the plugin
 */
if('cli' != php_sapi_name()) die('This is a command line script only');
if(!defined('DOKU_INC')) define('DOKU_INC', __DIR__ . '/../../../');
require_once(DOKU_INC . 'inc/init.php');

// build script
{
    // open output
    $fh = fopen(__DIR__ . '/extension/script.js', 'w');

    // add comment
    fwrite($fh, "/**
 * Injected content script, extending the DokuWiki toolbar
 *
 * This script is built automatically from the source files
 * using the extension.php script. It should not be edited.
 * See https://github.com/splitbrain/dokuwiki-plugin-toolbox
 * for the original files and for contributing to the extension.
 */
");

    // load the language files
    unset($lang);
    /** @var array $lang */
    include("lang/en/lang.php");
    fwrite($fh, 'var toolbox_lang = ' . json_encode($lang['js']) . ";\n");

    // set the icon base
    fwrite($fh, "var toolbox_icon = '//github.com/splitbrain/dokuwiki-plugin-toolbox/raw/master/pix/';\n");

    // add the scripts
    $scripts = glob(__DIR__ . '/Toolbox*.js');
    $scripts[] = __DIR__ . '/toolbox.js';
    foreach($scripts as $script) {
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
    $manifest = __DIR__ . '/extension/manifest.json';
    $m = json_decode(file_get_contents($manifest));
    $m->version = str_replace('-', '.', $info['date']);
    file_put_contents($manifest, json_encode($m, JSON_PRETTY_PRINT));
}

// create zip file
{
    $filename = __DIR__ . '/extension.zip';
    $zip = new ZipArchive();
    if($zip->open($filename, ZipArchive::CREATE) !== true) {
        die("cannot open <$filename>\n");
    }

    $files = glob(__DIR__ . '/extension/*');
    foreach($files as $file) {
        $zip->addFile($file, basename($file));
    }

    $zip->close();
}
