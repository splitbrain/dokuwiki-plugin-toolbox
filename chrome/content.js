/* global chrome */

/**
 * check if the current tab is a dokuwiki edit session and
 * inject the toolbox script if yes
 */
(function () {
    // guards to make sure we only run on DokuWiki:
    var gen = document.querySelector("meta[name='generator']");
    if(!gen || (gen.content.search(/DokuWiki/) === -1) ) return;
    var edi = document.querySelector("#wiki__text");
    if(!edi) return;

    // inject the script
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.src = chrome.extension.getURL('script.js');
    script.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
})();

