const fs = require("fs");
const yaml = require("js-yaml");
const VariableManager = require("./VariableManager.js");
const vm = new VariableManager();
const Article = function () {
    this.title = "",
    this.overview = "",
    this.sections = []
    this.downside = false;
}

function FileLoader() {

    this.readFileFromURL = function (path) {
        let article = new Article();
        console.log("START READING FILE: " + path);

        //Read file into Memory as UTF-8
        let content = fs.readFileSync(path, 'utf8');
        let variables = vm.readVariablesFromSCSS(content);
        this.extractCommentsFromFile(content, article);
        return article;
    }

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

        let regex_downside = new RegExp('(?<=("""))(downside)(?=""")');
        let downside = false;
        if (content.match(regex_downside) !== null) {
            downside = true;
        }

        let sections = this.extractSections(content);

        article.title = title;
        article.overview = overview;
        article.sections = sections;
        article.downside = downside;

        console.log("CREATE ARTICLE: " + article.title);
        console.log("---------------------");
        return article;
    }

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