if(window.toolbar!=undefined){
    toolbar[toolbar.length] = {
        "type":  "picker",
        "title": "Toolbox",
        "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/wrench_orange.png",
        "key":   "",
        "list": [
            {
                "type":  "toolbox_sort",
                "title": "Sort ascending",
                "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/sort_ascending.png",
                "key":   "",
                "reverse": 0
            },
            {
                "type":  "toolbox_sort",
                "title": "Sort descending",
                "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/sort_descending.png",
                "key":   "",
                "reverse": 1
            },
            {
                "type":  "toolbox_indent",
                "title": "Add Indention",
                "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/text_indent.png",
                "key":   "",
                "reverse": 0
            },
            {
                "type":  "toolbox_indent",
                "title": "Remove Indention",
                "icon":  DOKU_BASE+"lib/plugins/toolbox/pix/text_indent_remove.png",
                "key":   "",
                "reverse": 1
            }
        ]
    };
}


function tb_toolbox_sort(btn, opts, edid){
    var selection = getSelection($(edid));
    if(!selection.getLength()){
        alert('no text selected');
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

function tb_toolbox_indent(btn, opts, edid){
    var selection = getSelection($(edid));
    if(!selection.getLength()){
        alert('no text selected');
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
