const load_notes_list = require('./preload.js');
var fs = require('fs');
var current_note = null;

function save_note(){
    if(current_note == null){return}
    note_body = document.getElementById("note-body");
    note_text = note_body.getElementsByTagName("pre")[0].innerText;
    note_title = document.getElementById("note-title");
    
    note_json = JSON.parse(fs.readFileSync(`./notes/${current_note}`, 'utf-8'))
    note_content = fs.readFileSync(`./notes/${current_note.slice(0, -5)}`, 'utf-8');
    if(note_content != note_body.innerText || note_json.title != note_title.innerText){
        fs.writeFileSync(`./notes/${current_note}`, `{"title": "${note_title.innerText}", "body": ""}`)//${note_text}
        fs.writeFileSync(`./notes/${current_note.slice(0, -5)}`, `${note_text}`)
        load_notes_list();
    }
}

function display_note(note){
    document.getElementById("buttons").removeAttribute("hidden");
    document.getElementById("note-title").setAttribute("contenteditable", "true");

    save_note();

    note_body = document.getElementById("note-body");
    note_title = document.getElementById("note-title");
    
    note_json = JSON.parse(fs.readFileSync(`./notes/${note}`, 'utf-8'));
    note_content = fs.readFileSync(`./notes/${note.slice(0, -5)}`, 'utf-8');

    note_title.innerText = `${note_json.title}`
    note_body.innerHTML = `<pre contentEditable="true" class="ml-1 outline-none text-2xl text-neutral-300">${note_content}</pre>`;
    
    current_note = note;
    
    var load_notes_list = require("./preload.js");
    load_notes_list(current_note);
}

function create_new_note(){
    document.getElementById("note-body").innerHTML = `<pre contentEditable="true" class="ml-1 outline-none text-2xl text-neutral-300">This is a note.</pre>`;
    document.getElementById("note-title").innerText = "New Note";
    document.getElementById("buttons").removeAttribute("hidden");
    document.getElementById("note-title").setAttribute("contenteditable", "true");

    let time = Math.floor(Date.now() / 1000);
    current_note = time + ".json";
    fs.writeFileSync(`./notes/${current_note}`, `{"title": "New Note", "body": ""}`);
    fs.writeFileSync(`./notes/${time}`, `This is a note.`);

    load_notes_list(current_note);
}

function delete_note(){
    fs.unlinkSync(`./notes/${current_note}`);
    fs.unlinkSync(`./notes/${current_note.slice(0, -5)}`);
    document.getElementById("note-body").innerHTML = `<pre contentEditable="true" class="ml-1 outline-none text-2xl text-neutral-300"></pre>`;
    document.getElementById("note-title").innerText = "Welcome to StormNote";
    current_note = null;
    load_notes_list();
}

function test_dir(){
    console.log(`__dirname: ${__dirname}`);
    var directoryPath = path.join(__dirname, './notes/');
    var files = fs.readdirSync(directoryPath);
    files.sort(function(a, b) {return fs.statSync(directoryPath + a).mtime.getTime() - fs.statSync(directoryPath + b).mtime.getTime();});
    files.reverse();
    console.log(files);
}