module.exports = function() {
    // properly follow mobile redirect meta tags
    require("/custom_redirect.js")();

    // the global fns object contains many helper functions
    // These functions prepare a rewritten response to be served
    // with functional links, optimized DOM, and sanitized assets
    // Note: fns is provided via moov_stdlib
    fns.addCanonicalTag();
    fns.rewriteLinks();
    fns.absolutizeSrcs();
    fns.cleanMobileMetaTags();
    fns.removeAllStyles();
    fns.removeHtmlComments();
    fns.removeDesktopMobileIcon();
    fns.relocateScripts();
    fns.addAssets();

    // Modifying the head tag of the document using the global head selector
    $(head).prepend("<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>");

    head.append(tag('script', {'data-keep': 'true', type: 'text/javascript', src: fns.asset('javascript/head.js')}));
    body.append(tag('script', {'data-keep': 'true', type: 'text/javascript', src: fns.asset('javascript/body.js')}));

    // Modifying the body of the document using the global body selector
    scoped$(body, function() {
        require("/sections/header.js")();
        require("/sections/footer.js")();
        require("/mappings.js")();

        // Perf is used to reduce size of images on small screens
        require("/perf.js")();
    });

    fns.removeDesktopJs();
};