const FileLoader = require("./lib/FileLoader.js");

let articles = [];
main(process.argv);

function main(argv) {
    //1. Load Files
    let loader = new FileLoader();
    if(argv[2] !== null) {
       let article = loader.readFileFromURL(argv[2]);
       articles.push(article);
       console.log("Artikel: " + articles);
    } else {
        "No readable File! Please define a path in the CommandLine."
    }
    //2. create Articles
    //3. write HTML
}