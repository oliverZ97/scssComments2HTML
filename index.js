const hljs = require("highlight.js");
const FileLoader = require("./lib/FileLoader.js");
const loader = new FileLoader();
const fs = require("fs");
const path = require("path");
const articles = [];
const root = "../scssComments2HTML";

main(process.argv);

function main(argv) {
    let path = argv[2]
    console.log("---------------------");
    console.log("DIRECTORY TO LOOK FOR FILES: " + path);
    let filesUrls = getFilesFromDirectory(path);
    let articles = extractArticlesFromFiles(filesUrls);
    let snippets = renderArticlesToHtml(articles);
    let template = fillTemplateWithHTML(path, snippets);
    let importCSS = createSCSSImportFileContent(path);

    writeSCSSFile(importCSS);
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
        if(article.title === "Undefined") {
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
            let sec = "";
            //creates a unique id for every code snippet
            let id = "";
            let trigger = "#";
            let value = section[0].html;
            if(section.description === undefined) {
                //id = article.title + "_" + Math.random()*10000;
                id = article.title + "_" + 10000;
                trigger = trigger + id;
            } else {
                id = article.title + "_" + section.description;
                trigger = trigger + id;
            }
            console.log(id);
            if (article.downside === true) {
                sec = "<section class=\"lsg_section-ds\"><div>\n";
                let example = section[0].example;
                let description = "<p>" + section[0].description + "</p>\n";
                let copyBtn = "<button class=\"clipboard\" data-clipboard-target=\"" + trigger + "\" data-clipboard-text=\"success\">copy</button>\n";
                let mask = hljs.highlight('javascript', section[0].html).value;
                let html = "<figure>\n<pre>\n<code id=\"" + id + "\" >\n" + mask + "</code>\n</pre>\n</figure>\n";

                sec = sec + "<div class=\"lsg_description\">" + description + copyBtn + "</div>\n<div class=\"lsg_snippet-ds\">" + "<div class=\"lsg_example-ds\">" + example + "</div>\n<div class=\"lsg_snip-ds\">" + html + "</div>\n</div>";
                sec = sec + "</div></section>";
            } else {
                sec = "<section class=\"lsg_section\"><div>\n";
                let example = section[0].example;
                let description = "<p>" + section[0].description + "</p>\n";
                let copyBtn = "<button class=\"clipboard\" data-clipboard-target=\"" + trigger + "\" data-clipboard-text=\"success\">copy</button>\n";
                let mask = hljs.highlight('javascript', section[0].html).value;
                let html = "<figure id=\"" + id + "\" >\n<pre>\n<code >\n" + mask + "</code>\n</pre>\n</figure>\n";

                sec = sec + "<div class=\"lsg_description\">" + description +  copyBtn + "</div>\n<div class=\"lsg_snippet\">" + "<div class=\"lsg_example\">" + example + "</div>\n<div class=\"lsg_snip\">" + html + "</div>\n</div>";
                sec = sec + "</div></section>";
            }
            artHTMLString = artHTMLString + sec;
        })
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
}

function writeSCSSFile(scssContent) {
    fs.writeFileSync('./res/style.js', scssContent);
    console.log("WRITE FILE style.js");
    console.log("---------------------");
}