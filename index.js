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
    console.log(filesUrls);
    let articles = extractArticlesFromFiles(filesUrls);
    let snippets = renderArticlesToHtml(articles);
    let template = fillTemplateWithHTML(path, snippets);

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
            scssFiles.push(directory + "/"+ file);
        }
    });
    console.log("---------------------");

    return scssFiles;
}

function extractArticlesFromFiles(filesUrls) {

    filesUrls.forEach((fileUrl) => {
        let article = loader.readFileFromURL(fileUrl);
        articles.push(article);
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
    articles.map((article) => {
        console.log("RENDER ARTICLE: " + article.title);
        let title = "<h1 class=\"title\" id=\"" + article.title + "\">" + article.title + "</h1>\n";
        let overview = "<p>" + article.overview + "</p>\n";
        let artHTMLString = "<article class=\"article\">" + "<div class=\"article__header\">" + title + overview + "</div>\n<div class=\"article__sections\">";
        article.sections.map((section) => {
            let sec = "<section class=\"section\"><div>\n";
            let example = section[0].example;
            let description = "<p>" + section[0].description + "</p>\n";
            let mask = hljs.highlight('javascript', section[0].html).value;
            let html = "<figure>\n<pre>\n<code>\n" + mask + "</code>\n</pre>\n</figure>\n";

            sec = sec + "<div class=\"description\">" + description + "</div>\n<div class=\"snippet\">" + "<div class=\"example\">" + example + "</div>\n<div class=\"snip\">" +html + "</div>\n</div>";
            sec = sec + "</div></section>";
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
    let titles = articles.forEach(article => { 
        navString = navString + "<li class=\"nav__item\"><a class=\"link\" href=\"#"+ article.title + "\">" + article.title + "</a></li>\n";
    });
        
    let filledTemplateWithNav = filledTemplateWithSnippets.replace("NAV_PLACEHOLDER", navString);

    return filledTemplateWithNav;
}

function writeIndexHtml(htmlContent) { 
    fs.writeFileSync('./index.html', htmlContent);
    console.log("WRITE FILE index.html");
    console.log("---------------------");
}