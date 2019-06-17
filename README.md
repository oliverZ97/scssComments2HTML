#Team Enterprise Styleguide

This Tool reads commented .scss-Files from a specified Folder and extract the comments to html. 

**GETTING STARTED**

1. Navigate with your Terminal into the scssComments2HTML Folder.

2. To start copy all scss.-Files you want to use in your Styleguide in the /content-Folder

3. type "npm run build" in your terminal.

4. Out of all the content the Tool creates a styleguide.min.css and a webpage.min.css, placed in the /docs-Folder. A index.html is also created inside the /docs-Folder. This file contains the Living Styelguide which you can explore in your Browser.

**HOW TO USE THE STYLEGUIDE**

You can import the styleguide.min.css file with the <link>-Tag or you copy it directly into your Project and use it like a regulary .css-File.

**HOW IT WORKS**

1. The Tool looks for all .scss-Files in the Folder.

2. An Container is created for each .scss-File. Be sure that you follow the correct Format-Style to gather all informations from the file.

3. Every article should have a "title", an "overview" and as many "sections" you want

4. a section contains an "example" of the rendered object, an "snippet" which shows how the Code looks like. And also an optional description.

To read the correct information from the Files, your Comments should look like this:

![Format Example][./assets/readme_1.png]

5. Out of all the content the Tool creates a styleguide.min.css and a webpage.min.css, placed in the /docs-Folder. A index.html is also created inside the /docs-Folder. This file contains the Living Styelguide which you can explore in your Browser.