//Parameter: The Element which calls this function
//Return: 
//Usage: reads the dataset.target attribute of the elem, which contains the id of the target.
//       reads the innerHTML ofnthe target and calls the createWindowWithHTML-function
function getSectionContent(elem) {
    let example = document.getElementById(elem.dataset.target)
    let htmlToRender = example.innerHTML;
    createWindowWithHTML(htmlToRender);
}

//Parameter: String - a String containing HTML
//Return: 
//Usage: inserts the Parameter inside of a HTML-String and opens the content in a new Tab
function createWindowWithHTML(sectionContent) {
    let string = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Team Enterprise Styleguide</title><link rel=\"stylesheet\" type=\"text/css\" href=\"./webpage.min.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"./styleguide.min.css\"><link rel=\"icon\" type=\"image/svg\" href=\"../logo.jpg\" sizes=\"32x32\"></head><body id=\"lsg_body\">" + sectionContent + "</body></html>";
    let newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write(string);
    newWindow.document.close();
}