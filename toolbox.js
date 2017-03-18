// Add our toolbar picker
if (typeof toolbar == 'object' && typeof toolbox_initialized == 'undefined') {
    toolbar[toolbar.length] = {
        "type": "picker",
        "id": "toolbox__picker",
        "title": "Toolbox",
        "icon": toolbox_icon + "wrench_orange.png",
        "key": "",
        "list": [
            {
                "type": "toolbox_sort",
                "title": toolbox_lang.sortasc,
                "icon": toolbox_icon + "sort_ascending.png",
                "key": "",
                "reverse": 0
            },
            {
                "type": "toolbox_sort",
                "title": toolbox_lang.sortdesc,
                "icon": toolbox_icon + "sort_descending.png",
                "key": "",
                "reverse": 1
            },
            {
                "type": "toolbox_indent",
                "title": toolbox_lang.indent,
                "icon": toolbox_icon + "text_indent.png",
                "key": "",
                "reverse": 0
            },
            {
                "type": "toolbox_indent",
                "title": toolbox_lang.outdent,
                "icon": toolbox_icon + "text_indent_remove.png",
                "key": "",
                "reverse": 1
            },
            {
                "type": "toolbox_counter",
                "title": toolbox_lang.counter,
                "icon": toolbox_icon + "edit-number.png",
                "key": ""
            },
            {
                "type": "toolbox_find",
                "title": toolbox_lang.f_r,
                "icon": toolbox_icon + "edit-replace.png",
                "key": ""
            }
        ]
    };

    // avoid two pickers when plugin and greasemonkey is installed
    toolbox_initialized = 'yes';
}

/**
 * The Find and Replace dialog
 */
window.tb_toolbox_find = function (btn, opts, edid) {
    pickerClose();
    ToolboxFindAndReplace(edid);
};

/**
 * Sort the selected text
 */
window.tb_toolbox_sort = function (btn, opts, edid) {
    var field = jQuery('#' + edid)[0];
    var selection = DWgetSelection(field);
    if (!selection.getLength()) {
        alert(toolbox_lang.notext);
        return;
    }

    var text = selection.getText();
    text = text.split("\n");
    text.sort();
    if (opts['reverse']) text.reverse();
    text = text.join("\n");

    pasteText(selection, text, {});
    pickerClose();
};

/**
 * Indent the selected text
 */
window.tb_toolbox_indent = function (btn, opts, edid) {
    var field = jQuery('#' + edid)[0];
    var selection = DWgetSelection(field);
    if (!selection.getLength()) {
        alert(toolbox_lang.notext);
        return;
    }

    var text = selection.getText();
    text = text.split("\n");
    for (var i = 0; i < text.length; i++) {
        if (opts['reverse']) {
            text[i] = text[i].replace(/^  ?/, '');
        } else {
            text[i] = '  ' + text[i];
        }
    }
    text = text.join("\n");

    pasteText(selection, text, {});
    pickerClose();
};

/**
 * Count words and characters
 *
 * @link http://www.dokuwiki.org/tips:wordcounter
 */
window.tb_toolbox_counter = function (btn, opts, edid) {
    pickerClose();
    ToolboxCounter(edid);
};


