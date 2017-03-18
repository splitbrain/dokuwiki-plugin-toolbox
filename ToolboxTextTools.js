/**
 * Implements the text modification tools
 *
 * @param {string} edid
 * @constructor
 */
var ToolboxTextTools = function (edid) {

    var textarea = jQuery('#' + edid)[0];


    /**
     * Sort the current selection
     *
     * @param {boolean} reverse sort backwards?
     * @access public
     */
    function sort(reverse) {
        var selection = DWgetSelection(textarea);
        if (!selection.getLength()) {
            alert(toolbox_lang.notext);
            return;
        }

        var text = selection.getText();
        text = text.split("\n");
        text.sort(alphanumCase);
        if (reverse) text.reverse();
        text = text.join("\n");

        pasteText(selection, text, {});
    }

    /**
     * indent the current selection by 2
     *
     * @param {boolean} reverse unindent instead?
     * @access public
     */
    function indent(reverse) {
        var selection = DWgetSelection(textarea);
        if (!selection.getLength()) {
            alert(toolbox_lang.notext);
            return;
        }

        var text = selection.getText();
        text = text.split("\n");
        for (var i = 0; i < text.length; i++) {
            if (reverse) {
                text[i] = text[i].replace(/^  ?/, '');
            } else {
                text[i] = '  ' + text[i];
            }
        }
        text = text.join("\n");

        pasteText(selection, text, {});
    }

    /**
     * alphnumeric comparator
     *
     * @see http://www.davekoelle.com/files/alphanum.js
     * @see http://stackoverflow.com/a/2802489/172068
     * @access private
     */
    function alphanumCase(a, b) {
        function chunkify(t) {
            var tz = [];
            var x = 0, y = -1, n = 0, i, j;

            while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                var m = (i == 46 || (i >= 48 && i <= 57));
                if (m !== n) {
                    tz[++y] = "";
                    n = m;
                }
                tz[y] += j;
            }
            return tz;
        }

        var aa = chunkify(a.toLowerCase());
        var bb = chunkify(b.toLowerCase());

        for (x = 0; aa[x] && bb[x]; x++) {
            if (aa[x] !== bb[x]) {
                var c = Number(aa[x]), d = Number(bb[x]);
                if (c == aa[x] && d == bb[x]) {
                    return c - d;
                } else return (aa[x] > bb[x]) ? 1 : -1;
            }
        }
        return aa.length - bb.length;
    }


    // export public methods
    return {
        sort: sort,
        indent: indent
    }
};
