/**
 * Implements the Find and Replace dialog
 *
 * @param {string} edid
 * @constructor
 */
var ToolboxFindAndReplace = function (edid) {

    var textarea = jQuery('#' + edid)[0];

    // the dialog HTML
    var $dialog = jQuery(
        '<div>' +
        '<label>' +
        '<input type="text" class="find" />' +
        '<button class="find">' + toolbox_lang.find + '</button>' +
        '</label>' +

        '<label>' +
        '<input type="text" class="replace" />' +
        '<button class="replace">' + toolbox_lang.replace + '</button>' +
        '</label><br />' +

        '<button class="find_replace">' + toolbox_lang.find_replace + '</button>' +
        '<button class="replace_all">' + toolbox_lang.replace_all + '</button><br />' +


        '<label>' +
        '<input type="checkbox" class="casematch" value="1">&nbsp;' + toolbox_lang.casematch +
        '</label><br />' +

        '<label>' +
        '<input type="checkbox" class="regexp" value="1">&nbsp;' + toolbox_lang.regexp +
        '</label><br />' +

        '<label>' +
        '<input type="checkbox" class="words" value="1">&nbsp;' + toolbox_lang.wordmatch +
        '</label>' +

        '</div>'
    );

    // pointers to the various elements in the dialog
    $dialog.components = {
        in_find: $dialog.find('input.find'),
        btn_find: $dialog.find('button.find'),
        chk_casematch: $dialog.find('input.casematch'),
        chk_regexp: $dialog.find('input.regexp'),
        chk_words: $dialog.find('input.words'),
        in_replace: $dialog.find('input.replace'),
        btn_replace: $dialog.find('button.replace'),
        btn_find_replace: $dialog.find('button.find_replace'),
        btn_replace_all: $dialog.find('button.replace_all')
    };

    // register handlers
    $dialog.components.btn_find.click(handle_find);
    $dialog.components.btn_replace.click(handle_replace);
    $dialog.components.btn_find_replace.click(handle_find_replace);
    $dialog.components.btn_replace_all.click(handle_replace_all);


    /**
     * Initialize the dialog
     */
    $dialog.dialog({
        title: toolbox_lang.f_r,
        resizable: false,
        // show outside the textarea
        position: {
            my: 'right+25 bottom-25',
            at: 'right top',
            of: textarea
        },
        // clean up on close
        close: function () {
            $dialog.dialog('destroy');
            $dialog.remove();
        }
    });


    /**
     * Refocus the textarea after interaction with the dialog
     *
     * except for input fields. this makes sure selections are visible
     */
    $dialog.dialog('widget').mouseup(function (e) {
        if (e.target.nodeName == 'INPUT') return;
        window.setTimeout(function () {
            textarea.focus();
        }, 1);
    });


    /**
     * Handle find
     *
     * It highlights the next place where the current search term
     * can be found. Looking from the cursor position onward.
     *
     * @return {boolean} true when the word was found
     */
    function handle_find() {
        var sel = DWgetSelection(textarea);

        var term = $dialog.components.in_find.val();
        if (term == '') return false;

        var found = findNextPosition(term, sel.end);
        if (found[0] === -1) return false;
        selectWord(found[0], found[1].length);
        return true;
    }

    /**
     * Handle replace
     *
     * It replaces the current selection with the replacement
     *
     * @return {boolean} true when the selection was replaced
     */
    function handle_replace() {
        var sel = DWgetSelection(textarea);
        if (sel.start === sel.end) {
            window.alert(toolbox_lang.notext);
            return false;
        }
        var text = $dialog.components.in_replace.val();
        pasteText(sel, text, {startofs: 0, endofs: 0, nosel: true});
        return true;
    }

    /**
     * Handle find&replace
     *
     * Look for the next match and replace it
     *
     * @return {boolean}
     */
    function handle_find_replace() {
        return handle_find() && handle_replace();
    }

    /**
     * Handle replace all
     *
     * Counts matches first and asks for confirmation
     *
     * @return {boolean}
     */
    function handle_replace_all() {
        var term = $dialog.components.in_find.val();
        if (term == '') return false;
        var text = textarea.value;
        var repl = $dialog.components.in_replace.val();

        var re = makeRegexp(term, 'g');

        // count the matches
        var m;
        var found = 0;
        while (m = re.exec(text)) {
            found++;
        }

        if (!found) {
            window.alert(toolbox_lang.nothing);
            return false;
        }

        if (window.confirm(toolbox_lang.really.replace('%d', found))) {
            textarea.value = text.replace(re, repl);
            return true;
        }
        return false;
    }

    /**
     * Select the given range in the textarea and scrolls to it
     *
     * @param start
     * @param len
     */
    function selectWord(start, len) {
        var sel = DWgetSelection(textarea);

        // first move cursor only, defocus for a moment to make the area scroll
        sel.start = start;
        sel.end = start;
        sel.scroll = undefined;
        DWsetSelection(sel);
        textarea.blur();
        textarea.focus();

        // then select the found word
        sel.end = start + len;
        DWsetSelection(sel);
    }

    /**
     * Find the postion of the term right of pos
     *
     * @param {string} term
     * @param {int} pos
     * @returns {[{int}, {string}]} the position and the matched term
     */
    function findNextPosition(term, pos) {
        var text = textarea.value.substr(pos);
        var re = makeRegexp(term);
        var idx = text.search(re);
        if (idx === -1) {
            if (pos !== 0) {
                if (window.confirm(toolbox_lang.fromtop)) {
                    return findNextPosition(term, 0);
                } else {
                    return [-1, term];
                }
            } else {
                window.alert(toolbox_lang.nothing);
                return [-1, term];
            }
        }
        var match = text.match(re);
        return [pos + idx, match[0]];
    }

    /**
     * create the proper regexp to search for the given term
     *
     * It checks the current settings and sets the proper flags
     * for the regular expression. It also escapes the given term
     * if needed
     *
     * @param term
     * @param {string} [flags] initial regexp flags to set
     * @returns {RegExp}
     */
    function makeRegexp(term, flags) {
        if (!flags) flags = '';

        if (!$dialog.components.chk_regexp.prop('checked')) {
            term = quoteRE(term);
        }
        if (!$dialog.components.chk_casematch.prop('checked')) {
            flags += 'i';
        }
        if ($dialog.components.chk_words.prop('checked')) {
            term = '(?:\\b)' + term + '(?:\\b)';
        }

        console.log(term);

        try {
            return new RegExp(term, flags);
        } catch (e) {
            window.alert(toolbox_lang.reerror + '\n' + e.message);
            return null;
        }
    }

    /**
     * Escapes characters in the string that are not safe to use in a RegExp.
     *
     * @param {*} s The string to escape. If not a string, it will be casted to one.
     * @return {string} A RegExp safe, escaped copy of {@code s}.
     * @link http://stackoverflow.com/a/18151038/172068
     */
    function quoteRE(s) {
        return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
    }
};
