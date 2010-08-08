// ==UserScript==
// @name           DokuWiki Toolbox
// @author         Andreas Gohr
// @description    This script adds the DokuWiki toolbox to any DokuWiki install
// @namespace      http://userscripts.org/users/28853
// @include        *
// @run-at         document-end
// ==/UserScript==

try { if(top.location.href!=window.location.href) { return; } } catch(e) { return; }

// check if current page is a DokuWiki
var greasemonkey_dw_check = document.evaluate("//meta[@name='generator' and starts-with(@content,'DokuWiki')]",document,null,XPathResult.ANY_TYPE, null);
if(!greasemonkey_dw_check.iterateNext()) return;

// load this script into the page context
if(typeof __PAGE_SCOPE_RUN__ == 'undefined') {
   (function page_scope_runner() {
      var script = document.createElement('script');
      script.setAttribute("type", "application/javascript");
      script.textContent = "(function() { var __PAGE_SCOPE_RUN__ = 'yes'; (" + page_scope_runner.caller.toString() + ")(); })();";
      document.documentElement.appendChild(script);
      document.documentElement.removeChild(script);
   })();
   return;
}

var toolbox_icon = '//github.com/splitbrain/dokuwiki-plugin-toolbox/raw/master/pix/';

// this should fire after everything is done -
// when our button isn't there yet, reload the toolbar
// this is needed for Google Chrome unfortunately
window.addEventListener("load", function() {
    var tb = document.getElementById('toolboxpicker');
    if(!tb){
        initToolbar('tool__bar','wiki__text',toolbar);
    }
}, false);

// rest of the script is added here


