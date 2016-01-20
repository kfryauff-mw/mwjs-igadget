module.exports = function() {
    if ($(head).find("meta[name='mobile_redirect']").length > 0) {
        var redirect_url = $(head).find("meta[name='mobile_redirect']").attr("content");
        console.log("--> !!! found mobile_redirect meta tag in the head: Redirecting to " + redirect_url);
        ctx.env["Location"] = redirect_url;
    }
}