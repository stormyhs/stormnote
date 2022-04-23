var path = require('path');
var fs = require('fs');
var notes_path = path.join(__dirname, './notes/');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }
  
  // creates if doesnt exist - doesnt error if exists.
  fs.mkdir(`./notes/`, { recursive: true }, (error) => {
    if(error){
      console.log(error);
    }
  });

  load_notes_list();
})

function load_notes_list(current_note=null){
  // list of note files in the note dir
  var files = fs.readdirSync(notes_path);
  files.sort();

  // clear the notes list on the sidebar before rewriting it
  notes_list = document.getElementById("notes-list");
  notes_list.innerHTML = ``;

  for (var i = 0; i < files.length; i++) {
    if(files[i].endsWith(".json")){
      data = fs.readFileSync(`./notes/${files[i]}`, 'utf-8');
      note_data = JSON.parse(data);
      
      var highlight_color = "";
      if(current_note == files[i]){
        highlight_color = "bg-slate-700";
      }
      notes_list.innerHTML += `<p onclick="display_note('${files[i]}')" id="file-name" class="break-normal ${highlight_color} text-neutral-300">${note_data.title}</p>`;
    }
  }

}

module.exports = load_notes_list;
