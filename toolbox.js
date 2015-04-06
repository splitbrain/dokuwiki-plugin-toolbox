// Add our toolbar picker
if(typeof toolbar == 'object' && typeof toolbox_initialized == 'undefined'){
    toolbar[toolbar.length] = {
        "type":  "picker",
        "id": "toolboxpicker",
        "title": "Toolbox",
        "icon":  toolbox_icon+"wrench_orange.png",
        "key":   "",
        "list": [
            {
                "type":  "toolbox_sort",
                "title": toolbox_lang.sortasc,
                "icon":  toolbox_icon+"sort_ascending.png",
                "key":   "",
                "reverse": 0
            },
            {
                "type":  "toolbox_sort",
                "title": toolbox_lang.sortdesc,
                "icon":  toolbox_icon+"sort_descending.png",
                "key":   "",
                "reverse": 1
            },
            {
                "type":  "toolbox_indent",
                "title": toolbox_lang.indent,
                "icon":  toolbox_icon+"text_indent.png",
                "key":   "",
                "reverse": 0
            },
            {
                "type":  "toolbox_indent",
                "title": toolbox_lang.outdent,
                "icon":  toolbox_icon+"text_indent_remove.png",
                "key":   "",
                "reverse": 1
            },
            {
                "type":  "toolbox_counter",
                "title": toolbox_lang.counter,
                "icon":  toolbox_icon+"application_view_list.png",
                "key":   ""
            }
        ]
    };

    // avoid two pickers when plugin and greasemonkey is installed
    toolbox_initialized = 'yes';
}

/**
 * Sort the selected text
 */
window.tb_toolbox_sort = function(btn, opts, edid){
    var field = jQuery('#' + edid)[0];
    var selection = DWgetSelection(field);
    if(!selection.getLength()){
        alert(toolbox_lang.notext);
        return;
    }

    var text = selection.getText();
    text = text.split("\n");
    text.sort();
    if(opts['reverse']) text.reverse();
    text = text.join("\n");

    pasteText(selection,text,{});
    pickerClose();
};

/**
 * Indent the selected text
 */
window.tb_toolbox_indent = function(btn, opts, edid){
	var field = jQuery('#' + edid)[0];
    var selection = DWgetSelection(field);
    if(!selection.getLength()){
        alert(toolbox_lang.notext);
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
};

/**
 * Count words and characters
 *
 * @link http://www.dokuwiki.org/tips:wordcounter
 */
window.tb_toolbox_counter = function(btn, opts, edid){

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


    var obj  = jQuery('#' + edid)[0];
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
        out += toolbox_lang.total;
        out += "  "+toolbox_lang.chars.replace('%d',(call + csec));
        out += "  "+toolbox_lang.words.replace('%d',(wall + wsec))+"\n";

        out += toolbox_lang.section;
    }else{
        out += toolbox_lang.total;
    }
    out += "  "+toolbox_lang.chars.replace('%d',csec);
    out += "  "+toolbox_lang.words.replace('%d',wsec)+"\n";

    var selection = DWgetSelection(obj);
    if(selection.getLength()){
        var text = selection.getText();

        out += toolbox_lang.selection;
        out += "  "+toolbox_lang.chars.replace('%d',charcounter(text));
        out += "  "+toolbox_lang.words.replace('%d',wordcounter(text))+"\n";
    }

    pickerClose();
    alert(out);
};


