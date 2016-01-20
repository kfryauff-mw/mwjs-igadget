module.exports = function() {
    body.prepend(
        $(tag("header", {class: "mw-header"}), function() {
            // Move stuff here
        })
    );
};