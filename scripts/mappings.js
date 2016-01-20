var mappings = [
    [/^\/$|^\/\?/,
        "/pages/home.js"]
];

module.exports = function() {
    var status = env["status"], path = env["path"];
    if (status == "200") {
        var match = false;
        for (var i = 0; i < mappings.length; i++) {
            if (mappings[i][0].test(path)) {
                match = true;
                console.log("--> Importing " + mappings[i][1] + " in mappings.js");
                require(mappings[i][1])();
                break;
            }
        }

        if (!match) {
            console.log("--> No match in mappings. Perfect Proxying.");
            fns.perfectProxy();
        }
    }
    else {
        require("/pages/error.js")();
    }
};