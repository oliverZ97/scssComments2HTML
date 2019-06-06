function copyToClipboard() {
    let copyText = "document.getElementById(id)";
    copyText.select();
    document.execCommand("copy");
    alert("copied the text: " + copyText.value);
}