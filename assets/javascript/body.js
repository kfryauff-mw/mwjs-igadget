// Bundled with Fusion v0.1



/*
 * File: mw.Igadget-js.js
 */
var mw = mw || {};

mw.Igadget-js = {};

var iterator = mw.Igadget-js;

jQuery(document).ready(function moovwebmoduleLoad() {
  for(var moduleKey in iterator) {
    var module = iterator[moduleKey];
    if(module.name && (jQuery("body").hasClass(module.name) || module.name === "mw-global") && typeof module.init !== 'undefined') {
      console.log(module.name);
      module.init();
    }
  }
});





/*
 * File: body/mw.Igadget-js.base.js
 */
mw.Igadget-js.Base = function() {

  function initialize() {
    
  }


  return {
    init: initialize,
    name: "mw-global"
  }
}();



/*
 * File: body/stub.js
 */
// Delete me when ready
