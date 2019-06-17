function VariableManager() {

    this.readVariablesFromSCSS = function (content) {
        /*let regex_variable = new RegExp("(\$)(.)*(\n)");
        let variables = (content.match(regex_variable)[0]);
        console.log("Variable: ",variables);
    
        return variables;*/
    }
}

module.exports = VariableManager;

/*//Matches the title inside the """ without Keyword
        let regex_title = new RegExp('(?<=("""title))(.|\n)*?(?=""")');
        let title = "";
        if (content.match(regex_title) !== null) {
            title = content.match(regex_title)[0].trim();
        } else {
            console.error("ERROR: Title could not be found!");
            title = "Undefined"
        } */