This Tool reads commented .scss-Files from a specified Folder and extract the comments to html. 

**GETTING STARTED**

1. Navigate with your Terminal into the scssComments2HTML Folder.

2. To start the tool, type "node index.js ***Path to Folder***" in your terminal.

3. The Tool looks for all .scss-Files in the Folder.

4. An Article is created for each .scss-File. Be sure that you follow the correct Format-Style to gather all informations from the file.

5. Every article should have a "title", an "overview" and "sections"

6. a section contains an "example" of the rendered object, an "snippet" which shows how the Code looks like. And also an optional description.

To read the correct information from the Files, your Comments should look like this:

/*
"""title
Buttons
""" 

"""overview
This page descibes the existing button variations
"""
*/

.btn {

/*
---
description:  This is a Button.

example: >
    <button>
    button
    </button>

html: >
    <div>
        <button>button</button>
    </div>

---
*/

//CSS here

}

7. Missing content is replaced with a default value to not crash the script, but an Error is shown in the Terminal.

8. All the Content is placed in the index.html File.