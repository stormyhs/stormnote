var path = require('path');
var fs = require('fs');

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
  notes_list = document.getElementById("notes-list");
  notes_list.innerHTML = `<div id="buttons" class="flex"><h3 onclick="save_note()" id="save-note-button" class="text-neutral-500 text-xl mr-4" style="cursor: pointer;">[SAVE]</h3><h3 onclick="create_new_note()" id="new-note-button" class="text-neutral-500 text-xl mr-4" style="cursor: pointer;">[NEW]</h3><h3 onclick="delete_note()" id="delete-note-button" class="text-red-300 text-xl mr-4" style="cursor: pointer;">[DEL]</h3></div>`;
  
  var directoryPath = path.join(__dirname, './notes/');
  var files = fs.readdirSync(directoryPath);
  files.sort(function(a, b) {return fs.statSync(directoryPath + a).mtime.getTime() - fs.statSync(directoryPath + b).mtime.getTime();});
  files.reverse();

  let note_data = null;
  for (var i = 0; i < files.length; i++) {
    if(files[i].endsWith(".json")){
      data = fs.readFileSync(`./notes/${files[i]}`, 'utf-8');
      note_data = JSON.parse(data);
      if(current_note == files[i]){
        notes_list.innerHTML += `<p onclick="display_note('${files[i]}')" id="file-name" class="break-normal bg-slate-700 text-neutral-300">${note_data.title}</p>`;
      } else{
        notes_list.innerHTML += `<p onclick="display_note('${files[i]}')" id="file-name" class="break-normal text-neutral-300">${note_data.title}</p>`;
      }
    }
  }
}

module.exports = load_notes_list;