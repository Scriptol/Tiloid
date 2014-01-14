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
                "size": "60",
                "input": "d:\\Download-Dirs\\Scriptol.fr"
            },
            {
                "name": "rightpane",
                "label": "Right panel:",
                "size": "60",
                "input": "c:\\MinGW\\mingw32\\bin"
            }
        ]
    },
    "Bookmarks": {
        "list": [
            {
                "name": "lcontent",
                "label": "Left panel",
                "initial": "c:\\",
                "select": [
                    "c:\\",
                    "d:\\Download-Dirs\\Scriptol.fr\\Creation et gestion\\Ecrire pour le web",
                    "D:\\Art",
                    "d:\\Download-Dirs\\Scriptol.fr\\Compilateur"
                ]
            },
            {
                "name": "rcontent",
                "label": "Right panel",
                "initial": "c:\\",
                "select": [
                    "c:\\",
                    "w:\\",
                    "d:/",
                    "c:/MinGW",
                    "c:/MinGW/mingw32/bin"
                ]
            }
        ]
    }
}