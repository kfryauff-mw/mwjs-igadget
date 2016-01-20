module.exports = function() {

  /*
    This code is executed when there is an exception in your projects
    JavaScript code.

    request_id: The unique id for the exception. You can visit the MoovWeb
                Control Center to retreive the stack trace for this request id.

    error_code: Response error code

    upstream_url: The url that the exception occured on.

    You are encourced to create your own moov_error.html page. Update this file
    to transform your custom moov_error.html

    Since there is no moov_error.html file by default, we provice a simple html
    body here.

  */

  var html_body =
    "<!DOCTYPE html>" +
    "<html>" +
    " <head>" +
    "   <h2>Exception occured in client's code</h2>" +
    " <head>" +
    "   <body>" +
    "   <p id='rid'>rid</p>" +
    "   <script>" +
    "     var ele = document.getElementById('rid');" +
    "     var query = window.location.search;" +
    "     var array = /request_id=(.*)&upstream_url=(.*)&error_code=(.*)/.exec(query);" +
    "     console.log(query);" +
    "     console.log(array);" +
    "     ele.innerHTML = '<b>Error Information:</b>' + '<br>' + 'Request ID: ' " +
    "     + array[1] + '<br>' + 'Error code: ' + array[3] + '<br>' + 'Upstream url: '" +
    "     + array[2] + '<br>' + 'You can visit MoovWeb Control Center to retreive the " +
    "     stack trace using this request id.';" +
    "   </script>" +
    " </body>" +
    "<html>"

  fns.init$(html_body, {decodeEntities: false});
}
