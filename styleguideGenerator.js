const hljs = require("highlight.js");
const fs = require("fs");
const path = require("path");
const FileLoader = require("./lib/FileLoader.js");
const loader = new FileLoader();
const scssFiles = [];
const articles = [];
const allSections = [];
const categories = ["General", "Atoms", "Molecules", "Organisms"];
const root = "../scssComments2HTML";

main(process.argv);

//Parameter: Array - an Array of Type String[]
//Return: 
//Usage: This is the main-function. Leads all processes. The argv[2] contains the input from 
//       the Terminal which is called from the prebuild script in the package.json
function main(argv) {
    let path = argv[2]
    console.log("---------------------");
    console.log("DIRECTORY TO LOOK FOR FILES: " + path);
    let importCSS = getFilesFromDirectory(path);
    extractArticlesFromFiles(scssFiles);
    let sortedArticles = sortArticles();
    let htmlString = renderArticlesToHtml(sortedArticles);
    let template = fillTemplateWithHTML(htmlString);
    writeSCSSFile(importCSS);
    writeIndexHtml(template);
    console.log("FINISHED! HAVE FUN WITH YOUR STYLEGUIDE :D");
    console.log("---------------------");
}

//Parameter: String - relative Path to look for files. Startpoint is index.js
//Return: String - String with all Files from Type .scss as an import statement
//Usage: Search for .scss-Files and push them into const scssFiles. Also creates
//       String with an .scss import statement for each file.
function getFilesFromDirectory(directory) {
    let scssImportFileString = "";
    console.log("---------------------");
    console.log("FILES FOUND:");
    console.log("---------------------");
    fs.readdirSync(directory, "utf8").forEach(file => {
        if (path.extname(file) === ".scss") {
            console.log(file);
            scssFiles.push(directory + "/" + file);
            scssImportFileString = scssImportFileString + "import \'." + directory + "/" + file + "\';\n";
        }
    });
    console.log("---------------------");

    return scssImportFileString;
}

//Parameter: Array - Needs a String[] with the Paths of the .scss-Files
//Return: 
//Usage: calls readFileFromURL for each Object in the Array. If the title
//       Argument of the File is undefined it got sorted out. Otherwise
//       it's pushed into the Article[]
function extractArticlesFromFiles(filesUrls) {

    filesUrls.forEach((fileUrl) => {
        let article = loader.readFileFromURL(fileUrl);
        if (article.title === "Undefined") {
            return;
        } else {
            articles.push(article);
        }
    });
    console.log("ARTICLES:");
    console.log("---------------------");
    console.log(articles);
    console.log("---------------------");
}

//Parameter: 
//Return: 
//Usage: calls the sort-Method of Array and sort all Elements in the Array
//       alphabetically ascending.
function sortArticles() {
    articles.sort(function (a, b) {
        let titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase()
        if (titleA < titleB) //sort string ascending
            return -1
        if (titleA > titleB)
            return 1
        return 0 //default return value (no sorting)
    })
}

//Parameter: Array - Needs an Array of Type Article[]
//Return: Array - An Array of Type Array[]. Each Array contains the articles of a specific category
//Usage: creates an Array for each category and extract all articles with the specific
//       category out of the Input Array.
function sortArticlesByCategory(articles) {
    let titles_general = articles.filter((article => article.category === "General"));
    let titles_atom = articles.filter((article => article.category === "Atom"));
    let titles_molecule = articles.filter((article => article.category === "Molecule"));
    let titles_organism = articles.filter((article => article.category === "Organism"));

    let sortedArticlesByCat = [titles_general, titles_atom, titles_molecule, titles_organism];
    return sortedArticlesByCat;
}

//Parameter: 
//Return: String - Returns a String containing all articles and their content formatted in HTML
//Usage: Render all articlesand their content to one HTML String.
function renderArticlesToHtml() {
    let articlesAsString = "<div>";
    console.log("START TO RENDER ARTICLES");
    console.log("---------------------");
    let filterArticles = articles.filter((article => article.title !== "Undefined"));
    let sortedArticlesByCat = sortArticlesByCategory(filterArticles);
    let headlineIndex = 0;
    sortedArticlesByCat.forEach((arr) => {
        articlesAsString += "<h1 class=\"lsg_category_headline\" id=\"" + categories[headlineIndex] + "\">" + categories[headlineIndex] + "</h1>";
        arr.map((article) => {
            console.log("RENDER ARTICLE: " + article.title);
            let title = "<h1 class=\"lsg_title\" id=\"" + article.title + "\">" + article.title + "</h1>\n";
            let overview = "<p>" + article.overview + "</p>\n";
            let artHTMLString = "<article class=\"lsg_article\">" + "<div class=\"lsg_article__header\">" + title + overview + "</div>\n<div class=\"lsg_article__sections\">";
            article.sections.map((section) => {
                allSections.push(section);
                let sec = "";
                //creates a unique id for every code snippet
                //IMPROVE!!!
                let id = article.title + "_" + Math.round(Math.random() * 10000);  ;
                let trigger = "#" + id;
                let example_id = id + "_example";

                let example = "";
                if(article.title !== "Color-Palette") {
                     example = "<div id=\"" + example_id + "\">" + section[0].example + "</div>";
                } else {
                     example = "<div style=\"width:80%; max-width:400px;\" id=\"" + example_id + "\">" + section[0].example + "</div>";

                }
                let description = "<p>" + section[0].description + "</p>\n";
                let copyBtn = "<button class=\"clipboard lsg_button lsg_draw-border\" data-clipboard-target=\"" + trigger + "\">copy Snippet</button>\n";
                let openSectionBtn = "<button class=\"lsg_button lsg_draw-border js-tabOpener\" data-target=\"" + example_id + "\" onClick=\"getSectionContent(this)\">try MediaQueries</button>\n";
                let mask = hljs.highlight('html', section[0].html).value;
                let html = "<figure>\n<pre>\n<code  id=\"" + id + "\" >\n" + mask + "</code>\n</pre>\n</figure>\n";
                if (article.downside === true) {
                    sec = "<section class=\"lsg_section-ds\"><div>\n";
                    sec = sec + "<div class=\"lsg_section__header\">" + description + "<div>" + openSectionBtn + copyBtn + "</div></div>\n<div class=\"lsg_snippet-ds\">" + "<div class=\"lsg_example-ds\">" + example + "</div>\n<div class=\"lsg_snip-ds\">" + html + "</div>\n</div>";
                } else {
                    sec = "<section class=\"lsg_section\"><div>\n";
                    sec = sec + "<div class=\"lsg_section__header\">" + description + "<div>" + openSectionBtn + copyBtn + "</div></div>\n<div class=\"lsg_snippet\">" + "<div class=\"lsg_example\">" + example + "</div>\n<div class=\"lsg_snip\">" + html + "</div>\n</div>";
                    
                }
                sec = sec + "</div></section>";
                artHTMLString = artHTMLString + sec;
            })
            artHTMLString = artHTMLString + "</div>\n</article>";
            articlesAsString = articlesAsString + artHTMLString;
        })
        headlineIndex++;
    })
    
    console.log("---------------------");
    articlesAsString = articlesAsString + "</div>";
    return articlesAsString;
}

//Parameter: String - A String containing HTML
//Return: String - A String containing HTML
//Usage: reads a HTML-File called template.html and replaces the placeholders
//       inside with HTML-Strings.
function fillTemplateWithHTML(htmlString) {
    console.log("FILL TEMPLATE WITH HTML");
    console.log("---------------------");
    let htmlTemplate = null;
    fs.readdirSync(root, "utf8").forEach(file => {
        if (path.basename(file) === "template.html") {
            htmlTemplate = file;
        }
    });
    let fileContent = fs.readFileSync(htmlTemplate, 'utf8');
    let filledTemplateWithHTMLString = fileContent.replace("SNIPPET_PLACEHOLDER", htmlString);
    let filledTemplate = filledTemplateWithHTMLString.replace("NAV_PLACEHOLDER", createNav());

    return filledTemplate;
}

//Parameter: 
//Return: String - A String containing HTML
//Usage: creates a Navigation consisting of <li>- and <ul>-Tags
function createNav() {
    let navString = "";
    let filterArticles = articles.filter((article => article.title !== "Undefined"));
    let sortedArticlesByCat = sortArticlesByCategory(filterArticles);
    let categoryIndex = 0;
    sortedArticlesByCat.forEach((arr) => {
        navString += createNavSubList(arr, categories[categoryIndex]) + "\n";
        categoryIndex++;
    })

    return navString;
}

//Parameter: Array - an Array of Type Article[], String - a String containing the title of the sublist
//Return: String - A String containing HTML
//Usage: creates a String of an unordered List containing the titles of each article inside the Array
function createNavSubList(titles, name) {
    let subList = "<li class=\"lsg_nav__item\"><a class=\"lsg_link__head\" href=\"#" + name + "\">" + name + "</a><ul class=\"lsg_nav__list\">";
    titles.forEach(article => {
        subList += "<li class=\"lsg_nav__item\"><a class=\"lsg_link\" href=\"#" + article.title + "\">" + article.title + "</a></li>\n";
    });
    subList += "</ul></li>"
    return subList;
}

//Parameter: String - A String containing HTML
//Return:
//Usage: writes a File called index.html in the /res-Folder. The File contains an HTML-String
function writeIndexHtml(htmlContent) {
    fs.writeFileSync('./res/index.html', htmlContent);
    console.log("WRITE FILE index.html");
    console.log("---------------------");
}

//Parameter: String - A String containing SCSS import Statements
//Return:
//Usage: writes a File called style.js in the /res-Folder. 
//       This File is used to get all scss-Files inside the bundle.
function writeSCSSFile(scssContent) {
    fs.writeFileSync('./res/styleguide.js', scssContent);
    console.log("WRITE FILE styleguide.js");
    console.log("---------------------");
}