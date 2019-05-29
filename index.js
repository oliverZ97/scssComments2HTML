const FileLoader = require("./lib/FileLoader.js");
const loader = new FileLoader();
const fs = require("fs");
const path = require("path");
const articles = [];

main(process.argv);

function main(argv) {
    let path = argv[2]
    console.log("DIRECTORY TO LOOK FOR FILES: " + path);
    let filesUrls = getFilesFromDirectory(path);
    let articles = extractArticlesFromFiles(filesUrls);
    let snippets = renderArticlesToHtml(articles);
    let template = fillTemplateWithHTML(path, snippets);

    writeIndexHtml(template);
}

function getFilesFromDirectory(directory) {
    let scssFiles = [];
    console.log("---------------------");
    console.log("FILES:");
    console.log("---------------------");
    fs.readdirSync(directory, "utf8").forEach(file => {
        if (path.extname(file) === ".scss") {
            console.log(file);
            scssFiles.push(file);
        }
    });
    console.log("---------------------");
    console.log("---------------------");

    return scssFiles;
}

function extractArticlesFromFiles(filesUrls) {

    filesUrls.forEach((fileUrl) => {
        let article = loader.readFileFromURL(fileUrl);
        articles.push(article);
    });
    console.log("---------------------");
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
        let title = "<h1>" + article.title + "</h1>";
        let overview = "<p>" + article.overview + "</p>";
        let artHTMLString = "<article>" + title + overview;
        article.sections.map((section) => {
            let sec = "<section><div>";
            let example = section[0].example;
            let description = "<p>" + section[0].description + "</p>";
            let html = section[0].html;

            sec = sec + example + description + html;
            sec = sec + "</div></section>";
            artHTMLString = artHTMLString + sec;
        })
        artHTMLString = artHTMLString + "</article>";
        console.log("---------------------");
        console.log(artHTMLString);
        console.log("---------------------");
        articlesAsString = articlesAsString + artHTMLString;
    })
    articlesAsString = articlesAsString + "</div>";
    return articlesAsString;
}

function fillTemplateWithHTML(directory, snippets) {
    let htmlTemplate = null;
    fs.readdirSync(directory, "utf8").forEach(file => {
        if (path.basename(file) === "template.html") {
            htmlTemplate = file;
        }
    });
    let fileContent = fs.readFileSync(htmlTemplate, 'utf8');
    let filledTemplateWithSnippets = fileContent.replace("SNIPPET_PLACEHOLDER", snippets);

    let navString = "";
    let titles = articles.forEach(article => { 
        navString = navString + "<li><a>" + article.title + "</a></li>\n";
        console.log(navString);
    });
        
    let filledTemplateWithNav = filledTemplateWithSnippets.replace("NAV_PLACEHOLDER", navString);

    return filledTemplateWithNav;
}

function writeIndexHtml(htmlContent) { 
    fs.writeFileSync('./index.html', htmlContent);
    console.log("WRITE FILE index.html");
}