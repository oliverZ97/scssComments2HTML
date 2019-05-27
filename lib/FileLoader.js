const article= require("./Article");
const fs = require ("fs");

function FileLoader() {

    this.readFileFromURL = function(path) {

        //TODO: Prüfen ob Datei vom Typ SCSS oder CSS ist

        //Read file into Memory as UTF-8
        //returns a String
        console.log("Start Reading");

        let content = fs.readFileSync(path, 'utf8');

        let regex_title = new RegExp('(?<=("""title))(.|\n)*?(?=""")');
        let title = content.match(regex_title)[0].trim();

        let regex_overview = new RegExp('(?<=("""overview))(.|\n)*?(?=""")')
        let overview = content.match(regex_overview)[0].trim();

        article.title = title;
        article.overview = overview;

        return article;
    }

}

module.exports = FileLoader;