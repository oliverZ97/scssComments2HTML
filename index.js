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

    writeIndexHtml(snippets);
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
    console.log("START TO RENDER ARTICLES");
    console.log("---------------------");
    articles.map((article) => {
        console.log("RENDER ARTICLE: " + article.title);
        let title = "<h1>" + article.title + "</h1>";
        let overview = "<p>" + article.overview + "</p>";
        let artA = "<article>" + title + overview;
        article.sections.map((section) => {
            let sec = "<section><div>";
            let example = section[0].example;
            let description = "<p>" + section[0].description + "</p>";
            let html = section[0].html;

            sec = sec + example + description + html;
            sec = sec + "</div></section>";
            artA = artA + sec;
        })
        artA = artA + "</article>";
        console.log("---------------------");
        console.log(artA);
    })
}

function writeIndexHtml() { }