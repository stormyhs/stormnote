function parse_content(content){
    content = content.split("\n");
    parsed_content = "";
    content.forEach(line => {
        console.log(line);
        if(line.substring(0, 4) == "### "){
            parsed_content += `<h3 class="text-2xl">` + line.slice(4) + `</h3>`;
        }
        else if(line.substring(0, 3) == "## "){
            parsed_content += `<h2 class="text-3xl">` + line.slice(3) + `</h2>`;
        }
        else if(line.substring(0, 2) == "# "){
            parsed_content += `<h1 class="text-4xl">` + line.slice(2) + `</h1>`;
        }
        else{
            parsed_content += `<p class="text-lg">${line}</p>`;
        }
    });

    return parsed_content;
}

module.exports = parse_content;