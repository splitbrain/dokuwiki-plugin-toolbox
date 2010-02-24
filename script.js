if(window.toolbar!=undefined){
    toolbar[toolbar.length] = {
        "type":  "picker",
        "title": "Toolbox",
        "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/wrench_orange.png",
        "key":   "",
        "list": [
            {
                "type":  "toolbox_sort",
                "title": LANG.plugins.toolbox.sortasc,
                "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/sort_ascending.png",
                "key":   "",
                "reverse": 0
            },
            {
                "type":  "toolbox_sort",
                "title": LANG.plugins.toolbox.sortdesc,
                "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/sort_descending.png",
                "key":   "",
                "reverse": 1
            },
            {
                "type":  "toolbox_indent",
                "title": LANG.plugins.toolbox.indent,
                "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/text_indent.png",
                "key":   "",
                "reverse": 0
            },
            {
                "type":  "toolbox_indent",
                "title": LANG.plugins.toolbox.outdent,
                "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/text_indent_remove.png",
                "key":   "",
                "reverse": 1
            },
            {
                "type":  "toolbox_counter",
                "title": LANG.plugins.toolbox.counter,
                "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/application_view_list.png",
                "key":   "",
            }
        ]
    };
}

/**
 * Sort the selected text
 */
function tb_toolbox_sort(btn, opts, edid){
    var selection = getSelection($(edid));
    if(!selection.getLength()){
        alert(LANG.plugins.toolbox.notext);
        return;
    }

    var text = selection.getText();
    text = text.split("\n");
    text.sort();
    if(opts['reverse']) text.reverse();
    text = text.join("\n");

    pasteText(selection,text,{});
    pickerClose();
}

/**
 * Indent the selected text
 */
function tb_toolbox_indent(btn, opts, edid){
    var selection = getSelection($(edid));
    if(!selection.getLength()){
        alert(LANG.plugins.toolbox.notext);
        return;
    }

    var text = selection.getText();
    text = text.split("\n");
    for(var i=0; i<text.length; i++){
        if(opts['reverse']){
            text[i] = text[i].replace(/^  ?/,'');
        }else{
            text[i] = '  '+text[i];
        }
    }
    text = text.join("\n");

    pasteText(selection,text,{});
    pickerClose();
}

/**
 * Count words and characters
 *
 * @link http://www.dokuwiki.org/tips:wordcounter
 */
function tb_toolbox_counter(btn, opts, edid){

    function charcounter(text){
        var list = text.split(/[^\w\-_]+/);
        var len  = text.length;
        if(list[len-1] == '') len--;
        if(list[0] == '') len--;
        if(len < 0) len=0;
        return len;
    }

    function wordcounter(text){
        var list = text.split(/[^\w\-_]+/);
        var len  = list.length;
        if(list[len-1] == '') len--;
        if(list[0] == '') len--;
        if(len < 0) len=0;
        return len;
    }


    var obj  = $(edid);
    var call = 0;
    var wall = 0;
    var csec = charcounter(obj.value);
    var wsec = wordcounter(obj.value);

    if(obj.form.elements.prefix && obj.form.elements.prefix.value){
        call += charcounter(obj.form.elements.prefix.value);
        wall += wordcounter(obj.form.elements.prefix.value);
    }
    if(obj.form.elements.suffix && obj.form.elements.suffix.value){
        call += charcounter(obj.form.elements.suffix.value);
        wall += wordcounter(obj.form.elements.suffix.value);
    }

    var out = '';

    if(call){
        out += LANG.plugins.toolbox.total;
        out += "  "+LANG.plugins.toolbox.chars.replace('%d',(call + csec));
        out += "  "+LANG.plugins.toolbox.words.replace('%d',(wall + wsec))+"\n";

        out += LANG.plugins.toolbox.section;
    }else{
        out += LANG.plugins.toolbox.total;
    }
    out += "  "+LANG.plugins.toolbox.chars.replace('%d',csec);
    out += "  "+LANG.plugins.toolbox.words.replace('%d',wsec)+"\n";

    var selection = getSelection($(edid));
    if(selection.getLength()){
        var text = selection.getText();

        out += LANG.plugins.toolbox.selection;
        out += "  "+LANG.plugins.toolbox.chars.replace('%d',charcounter(text));
        out += "  "+LANG.plugins.toolbox.words.replace('%d',wordcounter(text))+"\n";
    }

    pickerClose();
    alert(out);
}


