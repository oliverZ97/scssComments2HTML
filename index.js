const hljs = require("highlight.js");
const fs = require("fs");
const path = require("path");

const FileLoader = require("./lib/FileLoader.js");
//const lsg_functionality = require("./res/lsg_functionality.js");
const loader = new FileLoader();

const articles = [];
const allSections = [];
const root = "../scssComments2HTML";

main(process.argv);

function main(argv) {
    let path = argv[2]
    console.log("---------------------");
    console.log("DIRECTORY TO LOOK FOR FILES: " + path);
    let filesUrls = getFilesFromDirectory(path);
    let articles = extractArticlesFromFiles(filesUrls);
    let sortedArticles = sortArticles();
    //const lsgf = new lsg_functionality(allSections);
    let snippets = renderArticlesToHtml(sortedArticles);
    let template = fillTemplateWithHTML(path, snippets);
    let importCSS = createSCSSImportFileContent(path);

    writeSCSSFile(importCSS);
    //addEventListenerToSectionBtn(id);
    writeIndexHtml(template);
    console.log("FINISHED! HAVE FUN WITH YOUR STYLEGUIDE :D");
    console.log("---------------------");
}

function getFilesFromDirectory(directory) {
    let scssFiles = [];
    console.log("---------------------");
    console.log("FILES FOUND:");
    console.log("---------------------");
    fs.readdirSync(directory, "utf8").forEach(file => {
        if (path.extname(file) === ".scss") {
            console.log(file);
            scssFiles.push(directory + "/" + file);
        }
    });
    console.log("---------------------");

    return scssFiles;
}

function createSCSSImportFileContent(directory) {
    let string = "";
    fs.readdirSync(directory, "utf8").forEach(file => {
        if (path.extname(file) === ".scss") {
            string = string + "import \'." + directory + "/" + file + "\';\n";
        }
    });

    return string;
}

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
    return articles;
}

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

function renderArticlesToHtml() {
    let articlesAsString = "<div>";
    console.log("START TO RENDER ARTICLES");
    console.log("---------------------");
    let filterArticles = articles.filter((article => article.title !== "Undefined"));
    filterArticles.map((article) => {
        console.log("RENDER ARTICLE: " + article.title);
        let title = "<h1 class=\"lsg_title\" id=\"" + article.title + "\">" + article.title + "</h1>\n";
        let overview = "<p>" + article.overview + "</p>\n";
        let artHTMLString = "<article class=\"lsg_article\">" + "<div class=\"lsg_article__header\">" + title + overview + "</div>\n<div class=\"lsg_article__sections\">";
        article.sections.map((section) => {
            allSections.push(section);
            let sec = "";
            //creates a unique id for every code snippet
            let id = "";
            let trigger = "#";
            if (section.description === undefined) {
                id = article.title + "_" + Math.round(Math.random() * 10000);  
            } else {
                id = article.title + "_" + section.description;
            }
            trigger = trigger + id;
            let example_id = id + "_example";
            if (article.downside === true) {
                sec = "<section class=\"lsg_section-ds\"><div>\n";
                let example = "<div id=\"" + example_id + "\">" + section[0].example + "</div>";
                let description = "<p>" + section[0].description + "</p>\n";
                let copyBtn = "<button class=\"clipboard lsg_button\" data-clipboard-target=\"" + trigger + "\">copy</button>\n";
                let openSectionBtn = "<button class=\"lsg_button js-tabOpener\" data-target=\"" + example_id + "\" onClick=\"getSectionContent(this)\">try MediaQueries</button>\n";
                let mask = hljs.highlight('html', section[0].html).value;
                let html = "<figure>\n<pre>\n<code  id=\"" + id + "\" >\n" + mask + "</code>\n</pre>\n</figure>\n";

                sec = sec + "<div class=\"lsg_section_header\">" + description + openSectionBtn + copyBtn + "</div>\n<div class=\"lsg_snippet-ds\">" + "<div class=\"lsg_example-ds\">" + example + "</div>\n<div class=\"lsg_snip-ds\">" + html + "</div>\n</div>";
                sec = sec + "</div></section>";
            } else {
                sec = "<section class=\"lsg_section\"><div>\n";
                let example = "<div id=\"" + example_id + "\">" + section[0].example + "</div>";
                let description = "<p>" + section[0].description + "</p>\n";
                let copyBtn = "<button class=\"clipboard lsg_button\" data-clipboard-target=\"" + trigger + "\">copy</button>\n";
                let openSectionBtn = "<button class=\"lsg_button js-tabOpener\" data-target=\"" + example_id + "\" onClick=\"getSectionContent(this)\">try MediaQueries</button>\n";
                let mask = hljs.highlight('html', section[0].html).value;
                let html = "<figure id=\"" + id + "\" >\n<pre>\n<code >\n" + mask + "</code>\n</pre>\n</figure>\n";

                sec = sec + "<div class=\"lsg_section_header\">" + description + "<div>" + openSectionBtn + copyBtn + "</div></div>\n<div class=\"lsg_snippet\">" + "<div class=\"lsg_example\">" + example + "</div>\n<div class=\"lsg_snip\">" + html + "</div>\n</div>";
                sec = sec + "</div></section>";
            }
            artHTMLString = artHTMLString + sec;
        })
        //console.log(allSections);
        artHTMLString = artHTMLString + "</div>\n</article>";
        articlesAsString = articlesAsString + artHTMLString;
    })
    console.log("---------------------");
    articlesAsString = articlesAsString + "</div>";
    return articlesAsString;
}

function fillTemplateWithHTML(directory, snippets) {
    console.log("FILL TEMPLATE WITH HTML");
    console.log("---------------------");
    let htmlTemplate = null;
    fs.readdirSync(root, "utf8").forEach(file => {
        if (path.basename(file) === "template.html") {
            htmlTemplate = file;
        }
    });
    let fileContent = fs.readFileSync(htmlTemplate, 'utf8');
    let filledTemplateWithSnippets = fileContent.replace("SNIPPET_PLACEHOLDER", snippets);

    let navString = "";
    let filterArticles = articles.filter((article => article.title !== "Undefined"));
    let titles = filterArticles.forEach(article => {
        navString = navString + "<li class=\"lsg_nav__item\"><a class=\"lsg_link\" href=\"#" + article.title + "\">" + article.title + "</a></li>\n";
    });

    let filledTemplateWithNav = filledTemplateWithSnippets.replace("NAV_PLACEHOLDER", navString);

    return filledTemplateWithNav;
}

function writeIndexHtml(htmlContent) {
    fs.writeFileSync('./res/index.html', htmlContent);
    console.log("WRITE FILE index.html");
    console.log("---------------------");
    //window.open('./res/index.html', _blank);
}

function writeSCSSFile(scssContent) {
    fs.writeFileSync('./res/style.js', scssContent);
    console.log("WRITE FILE style.js");
    console.log("---------------------");
}

function addEventListenerToSectionBtn(id) {
    let c = "dfsdfkjgfgkdfgjkldfjgdlfkgjdf";
    document.getElementById(id).addEventListener('click', handleSectionsInNewTab(c))
}

function handleSectionsInNewTab(sectionContent) {
    //lsgf.writeFileFromSection(sectionContent);
}