module.exports = function() {
    // body.append(
    //     $(tag("footer", {class: "mw-footer"}, "Powered by Moovweb"), function() {
    //         // Move stuff here
    //     })
    // );

    var footer = $("#Footer");
    footer
      .addClass("mw-footer")
      .empty()
      .append("<div>All prices are in USD</div>")
      .append("<div>Copyright 2013 iGadgetCommerce</div>")
      .append("<br />")
      .append("<div>Powered by</div>")
      .append("<div class='mw_logo sprites-moovweb'></div>");


    // This injects a snippet of code used locally with gulp live-reloading
    // Note: assert statements are ignored in production.
    fns.assert(true, function(){
      if (fns.layer('live-reload'))
        require("/sections/browsersync.js")();
    });
};
