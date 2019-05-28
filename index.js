const FileLoader = require("./lib/FileLoader.js");
const loader = new FileLoader();
const fs = require("fs");
const path = require("path");
const articles = [];

main(process.argv);

function main(argv) {
    console.log(argv);
    let path = argv[2]
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

function renderArticlesToHtml() { }

function writeIndexHtml() { }