/**
 * Implements the Word and Char counter
 *
 * @param {string} edid
 * @link http://www.dokuwiki.org/tips:wordcounter
 * @constructor
 */
var ToolboxCounter = function (edid) {

    var textarea = jQuery('#' + edid)[0];

    /**
     * Count the charactes in the given text
     *
     * @param {string} text
     */
    function charcounter(text) {
        var list = text.split(/[^\w\-_]+/);
        var len = text.length;
        if (list[len - 1] == '') len--;
        if (list[0] == '') len--;
        if (len < 0) len = 0;
        return len;
    }

    /**
     * Count the words in the given text
     *
     * @param {string} text
     */
    function wordcounter(text) {
        var list = text.split(/[^\w\-_]+/);
        var len = list.length;
        if (list[len - 1] == '') len--;
        if (list[0] == '') len--;
        if (len < 0) len = 0;
        return len;
    }

    /**
     * Returns the counts of the different parts
     *
     * @return {{call: int, wall: int, csec: int, wsec: int, csel: int, wsel: int}}
     */
    function agggregateCounts() {
        var counts = {
            call: 0,
            wall: 0,
            csec: charcounter(textarea.value),
            wsec: wordcounter(textarea.value),
            csel: 0,
            wsel: 0
        };
        counts.call += counts.csec;
        counts.wall += counts.wsec;

        if (textarea.form.elements.prefix && textarea.form.elements.prefix.value) {
            counts.call += charcounter(textarea.form.elements.prefix.value);
            counts.wall += wordcounter(textarea.form.elements.prefix.value);
        }
        if (textarea.form.elements.suffix && textarea.form.elements.suffix.value) {
            counts.call += charcounter(textarea.form.elements.suffix.value);
            counts.wall += wordcounter(textarea.form.elements.suffix.value);
        }

        var selection = DWgetSelection(textarea);
        if (selection.getLength()) {
            var text = selection.getText();
            counts.csel = charcounter(text);
            counts.wsel = wordcounter(text);
        }

        return counts;
    }

    /**
     * Return the HTML for one count section
     *
     * Returns an empty string if chars is 0
     *
     * @param {string} head headline for this section
     * @param {int} chars character count
     * @param {int} words word count
     * @return {string}
     */
    function html(head, chars, words) {
        var out = '';

        if (!chars) return out;

        out += '<dt>' + head + '</dt>';
        out += '<dd>' + toolbox_lang.chars.replace('%d', chars) + '</dd>';
        out += '<dd>' + toolbox_lang.words.replace('%d', words) + '</dd>';
        return out;
    }

    // prepare the dialog
    var counts = agggregateCounts();
    var $dialog = jQuery(
        '<div><dl>' +
        html(toolbox_lang.total, counts.call, counts.wall) +
        html(toolbox_lang.section, counts.csec, counts.wsec) +
        html(toolbox_lang.selection, counts.csel, counts.wsel) +
        '</dl></div>'
    );

    // show the edialog
    $dialog.dialog({
        modal: true,
        title: toolbox_lang.counter,
        resizable: false,
        buttons: {
            'Ok': function () {
                $dialog.dialog('close')
            }
        },
        // clean up on close
        close: function () {
            $dialog.dialog('destroy');
            $dialog.remove();
        }
    });
};
