/*
* Multiple functions in this file (and in preload.js) do the exact same thing (re-building the note body div).
* It would be a good idea to turn that into a function, or even better, not do that at all.
*/

const load_notes_list = require('./preload.js');
const parse_content = require('./parser.js');

var fs = require('fs');
var current_note = null;
var md_mode = false;

function switch_view(){
    if(md_mode){
        md_mode = false;
        document.getElementById("enablemd").removeAttribute("hidden");
        document.getElementById("disablemd").setAttribute("hidden", "");
    } else {
        md_mode = true;
        document.getElementById("disablemd").removeAttribute("hidden");
        document.getElementById("enablemd").setAttribute("hidden", "");
    }

    console.log(md_mode);

    if(current_note != null){
        display_note(current_note);
    }
}

function save_note(){
    if(current_note == null){return}
    if(md_mode){return}
    note_body = document.getElementById("note-body");
    note_text = note_body.getElementsByTagName("textarea")[0].value;
    note_title = document.getElementById("note-title");
    
    note_json = JSON.parse(fs.readFileSync(`./notes/${current_note}`, 'utf-8'))
    note_content = fs.readFileSync(`./notes/${current_note.slice(0, -5)}`, 'utf-8');
    if(note_content != note_body.innerText || note_json.title != note_title.innerText){
        // TODO: Stop using a whole JSON file for the title, or add more useful data to it.
        fs.writeFileSync(`./notes/${current_note}`, `{"title": "${note_title.innerText}"}`)
        fs.writeFileSync(`./notes/${current_note.slice(0, -5)}`, `${note_text}`)
        load_notes_list(current_note);
    }
}

function display_note(note){
    document.getElementById("buttons").removeAttribute("hidden");
    document.getElementById("note-title").setAttribute("contenteditable", "true");

    note_body = document.getElementById("note-body");
    note_title = document.getElementById("note-title");

    note_json = JSON.parse(fs.readFileSync(`./notes/${note}`, 'utf-8'));
    note_content = fs.readFileSync(`./notes/${note.slice(0, -5)}`, 'utf-8');

    note_title.innerText = `${note_json.title}`
    // this tag has changed `4` times.

    if(md_mode){
        note_body_html = `<pre style="display:inline-block; box-sizing: border-box; font-family: Roboto" class="ml-1 outline-none w-full h-full text-2xl text-neutral-300 bg-slate-800">`;
        note_body_html += parse_content(note_content);
        note_body_html += `</pre>`;
    } else{
        note_body_html = `<textarea style="display:inline-block; box-sizing: border-box;" class="ml-1 outline-none w-full h-full text-2xl text-neutral-300 bg-slate-800">`;
        note_body_html += `${note_content}`;
        note_body_html += `</textarea>`;
    }
    note_body.innerHTML = note_body_html
    
    current_note = note;
    
    var load_notes_list = require("./preload.js");
    load_notes_list(current_note);

    parse_content(note_content);
}

function create_new_note(){
    document.getElementById("note-body").innerHTML = `<textarea style="display:inline-block; box-sizing: border-box;" class="ml-1 outline-none w-full h-full text-2xl text-neutral-300 bg-slate-800">This is a new note.</textarea>`;
    document.getElementById("note-title").innerText = "New Note";
    document.getElementById("buttons").removeAttribute("hidden");
    document.getElementById("note-title").setAttribute("contenteditable", "true");
    
    let time = Math.floor(Date.now() / 1000);
    current_note = time + ".json";
    fs.writeFileSync(`./notes/${current_note}`, `{"title": "New Note"}`);
    fs.writeFileSync(`./notes/${time}`, `This is a note.`);
    
    display_note(current_note);
}

function delete_note(){
    fs.unlinkSync(`./notes/${current_note}`);
    fs.unlinkSync(`./notes/${current_note.slice(0, -5)}`);
    document.getElementById("note-body").innerHTML = `<pre contentEditable="true" class="ml-1 outline-none text-2xl text-neutral-300"></pre>`;
    document.getElementById("note-title").innerText = "Welcome to StormNote";
    current_note = null;
    load_notes_list();
}
