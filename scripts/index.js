// This sample documents the conventions and expectations for performing
// client javascript transformations.

// The code in this project will transform requests from all over the web

// The following function is executed per request and will determine what is served to the user

// It must return an object which can include the following fields:
// { body: < the transformed content in utf8 format>,
//     htmlparsed: <boolean: was content was transformed or not?>,
//     exports: <a string -> string dictionary, effectively a copy of env to capture any changes made in the script>
// }


// Note: If you have not done so already, from your terminal, run:
//     npm install
// to fetch all dependencies listed in this project's package.json file from https://npm.moovweb.net
// then run
//     npm run bundle
// to begin automatically generating the main.js file used to run this project.

module.exports = function() {
    // "body" is the response of any request that goes upstream (to our customers' sites)
    let upstreamResponse = body;
    // Now that we have our content, we need to decide what to do before sending it to the user

    // If we are in the SDK and the URL includes ?moov_debug=true, break at the 1st line of index.js
    if (env.path.indexOf("moov_debug=true") >= 0) {
        breakpoint("Parameter 'moov_debug=true' detected in the URL.");
    }

    // Dependencies will be saved in the node_modules folder
    // You can read their source code to better understand what is available to you!

    // The env object contains headers and meta-information about each request.
    // By filtering based on content_type, we can decide if and
    // how we want to modify the document before serving it to the user:
    var contentType = env["content_type"] || "";
    if (contentType.indexOf("html") > -1) {

        // You can use the init$ method to serialize the upstreamResponse into a traversable object
        // It gives you access to the $ variable
        // It will also give you access to new global variables  root, html, head, and body, which are
        // subsections of various parts of the upstreamResponse DOM tree seen by $.
        fns.init$(upstreamResponse);

        // init$ accepts an optional list of arguments that augment the cheerio parser used to traverse the dom

        // Ex: ignore decoding non-unicode characters
        // fns.init$(upstreamResponse, {decodeEntities: false})

        // You can inspect the object returned by fns.init$ to see what globals are provided for you.

        // $ is a function that can be used similar to jQuery to select any DOM node
        // It starts from the root no matter where it is called

        // Ex: select and remove all anchor tags in the document
        // $("a").remove()

        // Ex: Add an attribute to all selected nodes
        // $("div", function(){
        //     $this.attr("class","my-class")
        // })

        // scoped$ can be used to limit your selection to any section of the dom,
        // including the root, html, head, and body nodes like so:

        // scoped$(body, function(){
        //     scoped$("script").remove() // remove all script tags in the body
        // }) ;

        // You can combine the $ and scoped$ to scope into a node (say, the body)
        // and select nodes from the global scope

        // Ex: Set the data-body-script to true for to all scripts detected in the body
        //     Then add the data-global-script to all scripts in the document while scoped in the body
        // scoped$(body, function(){
        //     scoped$("script", function(){
        //         $this.attr("data-body-script",true)
        //     });
        //     $("script", function(){
        //         $this.attr("data-global-script",true)
        //     });
        // });

        // You can also load the upstreamResponse into moovweb's parsing library manually:
        // let $ = cheerio.load(body);
        // This can be useful if you need access to cheerio's advanced functionality.

        // Assigning a particular cheerio selection to a variable
        // dramatically reduces time required to apply the transformations.

        // If you plan on manipulating the same DOM section in multiple files,
        // use similar syntax to prevent re-traversing the DOM polynomially

        // By requiring and executing the html.js file, we perform all the transformations inside
        // Open this file in your text editor for more details.
        require("/html.js")();

        // When you are ready to render a tree of dom nodes into serialized html,
        // use the $.html() function.

        return { body: $.html(), htmlparsed: true };
    } else if (contentType.indexOf("application/json") > -1) {
        // In this example, we require the json.js file whenever we receive json requests;
        // this will return a rewritten version of json requests passed through the server
        return { body: require("/json.js")(), htmlparsed: false };
    }

    //// This code prevents crawlers from accessing non-production urls
    // Not required, but recommended.
    // else if (fns.isRobots()) {
    //     return { body: fns.handleRobots(body), htmlparsed: true };
    // }

    //// An example of handling xml inputs:
    // else if (contentType.indexOf("xml") > -1) {
    //     fns.init$(upstreamResponse, {xmlMode: true});
    //     return { body: $.xml(), htmlparsed: true };
    // }

    else {
        // When we get here, we haven't matched any content Type that we plan on transforming.
        console.log("Passing through " + contentType + " unmodified.");
    }
    // In the case that you do not wish to perform any transformations,
    // you can always serve the original content.
    return { htmlparsed: false };
};
