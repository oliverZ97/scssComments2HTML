function Lsg_functionality() {
    setListener();
}

function setListener() {
    let listener = document.getElementsByClassName('js-tabOpener');
    let listener_arr = Array.from(listener);
    listener_arr.forEach((elem) => {
        console.log(elem);
        //elem.addEventListener('click', getSectionContent(elem), false );
    })
}

function getSectionContent(elem) {
    let example = document.getElementById(elem.dataset.target)
    let htmlToRender = example.innerHTML;
    createWindowWithHTML(htmlToRender);
}

function createWindowWithHTML(sectionContent) {
    //let content = fs.readFileSync("./sectionTemplate.html", "utf-8");
    let string = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Team Enterprise Styleguide</title><link rel=\"stylesheet\" type=\"text/css\" href=\"./webpage.min.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"./styleguide.min.css\"><link rel=\"icon\" type=\"image/svg\" href=\"../logo.jpg\" sizes=\"32x32\"></head><body id=\"lsg_body\">" + sectionContent + "</body></html>";
    //console.log(content);

    let newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write(string);
    newWindow.document.close();
}

function writeFileFromSection (sectionContent) {
    let filename = sectionContent.description || "file" + Date.now;
    fs.writeFileSync("../temp/" + filename, sectionContent);
    console.log("WRITE FILE ", filename);
    console.log("---------------------");

    this.openSectionInBrowser(filename);
}

function openSectionInBrowser(filename) {
    //window.open("../temp/" + filename, "_blank");
    console.log("open?");
}


document.addEventListener('DOMContentLoaded', Lsg_functionality());

//module.exports = Lsg_functionality;