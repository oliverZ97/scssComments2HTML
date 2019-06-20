const fs = require("fs");
const yaml = require("js-yaml");
const Article = function () {
    this.title = "",
    this.overview = "",
    this.sections = []
    this.category = "";
    this.downside = false;
}

function FileLoader() {

    //Parameter: String - A String containing the path of the file relative to the index.js-File
    //Return: Object - an Object of Type Article
    //Usage: Reads the File at the given Path and save their contents in the Article-Object.
    this.readFileFromURL = function (path) {
        let article = new Article();
        console.log("START READING FILE: " + path);

        //Read file into Memory as UTF-8
        let content = fs.readFileSync(path, 'utf8');
        this.extractCommentsFromFile(content, article);
        return article;
    }

    //Parameter: String - A String containing scss and other informations to fill an Article-Object
    //Parameter: Object - An Article-Object
    //Return: Object - an Object of Type Article
    //Usage: extract all properties in the String by a keyword and assign them to the Article-Object
    this.extractCommentsFromFile = function (content, article) {
        //Matches the title inside the """ without Keyword
        let regex_title = new RegExp('(?<=("""title))(.|\n)*?(?=""")');
        let title = "";
        if (content.match(regex_title) !== null) {
            title = content.match(regex_title)[0].trim();
        } else {
            console.error("ERROR: Title could not be found!");
            title = "Undefined"
        }


        //Matches the overview inside the """ without Keyword
        let regex_overview = new RegExp('(?<=("""overview))(.|\n)*?(?=""")');
        let overview = ""
        if (content.match(regex_overview) !== null) {
            overview = content.match(regex_overview)[0].trim();
        } else {
            console.error("ERROR: Overview could not be found")
            overview = "Undefined";
        }

        let regex_category = new RegExp('(?<=("""category))(.|\n)*?(?=""")');
        let category = "";
        if (content.match(regex_category) !== null) {
            category = content.match(regex_category)[0].trim();
        } else {
            console.error("ERROR: Category could not be found")
            category = "Undefined";
        }

        let regex_downside = new RegExp('(?<=("""))(downside)(?=""")');
        let downside = false;
        if (content.match(regex_downside) !== null) {
            downside = true;
        }

        let sections = this.extractSections(content);

        article.title = title;
        article.overview = overview;
        article.sections = sections;
        article.category = category;
        article.downside = downside;

        console.log("CREATE ARTICLE: " + article.title);
        console.log("---------------------");
        return article;
    }

    //Parameter: String - A String containing scss and other informations to fill an Article-Object
    //Return: Array - An Array of Type String[]
    //Usage: extract the sections out of the String and put each of them together in an Array.
    this.extractSections = function (content) {
        let rawSections = [];
        console.log("Number of Chars in File: " + content.length);
        let startIdx = 0; //Index from where the indexOf - Function searches the searchstring
        while (startIdx <= content.length) {

            let begin = content.indexOf("---", startIdx);
            if (begin === -1) {
                console.log("No start element found!")
                break;
            }

            let end = content.indexOf("---", begin + 3);
            if (end === -1) {
                console.log("No end element found!")
                break;
            }

            let rawSection = content.substring(begin + 3, end);
            rawSections.push(rawSection);

            startIdx = end + 3;
        }

        let sections = [];
        rawSections.map((section) => {
            let newSection = yaml.loadAll(section);
            sections.push(newSection);
        })

        console.log("FINISH READING FILE");

        return sections;
    }
}

module.exports = FileLoader;