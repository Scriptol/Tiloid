var config={
    "Archiver": {
        "name": "archiver",
        "input": "pkzip.exe -add -rec -dir"
    },
    "Unarchive": {
        "list": [
            {
                "name": "overwrite",
                "label": "Overwrite",
                "checkbox": true
            },
            {
                "name": "path",
                "label": "Keep paths",
                "checkbox": false
            }
        ]
    },
    "Memory": {
        "list": [
            {
                "name": "leftpane",
                "label": "Left panel:",
                "input": "c:\\Users\\moi\\Documents\\LogoMaker"
            },
            {
                "name": "rightpane",
                "label": "Right panel:",
                "input": "w:\\scriptol.com"
            }
        ]
    }
}