// Bundled with Fusion v0.1



/*
 * File: host_map.js
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  WARNING: Moovweb auto-generated file. Any changes you make here will *
 *  be overwritten.                                                      *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function(){

var mapProxyToOrigin = {"http://mlocal.igadgetcommerce.com":"http://www.igadgetcommerce.com","http://survey.igadgetcommerce.com":"http://www.anymeme.org","https://mlocal.igadgetcommerce.com":"https://www.igadgetcommerce.com","https://survey.igadgetcommerce.com":"https://www.anymeme.org"};
var mapOriginToProxy = {"http://igadgetcommerce.com":"http://mlocal.igadgetcommerce.com","http://www.anymeme.org":"http://survey.igadgetcommerce.com","http://www.igadgetcommerce.com":"http://mlocal.igadgetcommerce.com","https://igadgetcommerce.com":"https://mlocal.igadgetcommerce.com","https://www.anymeme.org":"https://survey.igadgetcommerce.com","https://www.igadgetcommerce.com":"https://mlocal.igadgetcommerce.com"};

if (typeof(mw) == "undefined") {
	window.mw = {};
}

if(typeof(mw.catch_all_domain) == "undefined") {
	mw.catch_all_domain = ".moovapp.com";
} else {
  if (mw.catch_all_domain[0] != ".") {
  	console.log("Bad catch all domain");
  }
}


function detect_catch_all(url) {
	var found_index = url.host.indexOf(mw.catch_all_domain);
	var length = url.host.length;

	if (found_index != -1 && (found_index + mw.catch_all_domain.length) == length) {
		return true;
	}
	return false;
}

function strip_catch_all(url) {
	var found_index = url.host.indexOf(mw.catch_all_domain);
	var length = url.host.length;

	url.host = url.host.slice(0, found_index);
	return url;
}

function add_catch_all(url) {
	url.host = url.host + mw.catch_all_domain;
	return url;	
}

function getParsedURL(url) {
	var elem = document.createElement("a")
	elem.href = url;
	return elem;
}

function getSchemeAndHostname(url) {
	var result = {};
	result.scheme = url.protocol;
	result.host = url.host;
	return result;
}

function getKey(url) {
	var components = getSchemeAndHostname(url);
	return components.scheme + "//" + components.host;
}

function fetch(url, map) {
	var key = getKey(url);
	var result = map[key];
	
	if (result === undefined) {
		if (typeof(mw) != 'undefined' && mw.debug == true) {
			console.log("Warning. No rule to modify host (" + key + ").")
		}
		return url.href;
	}
	
	return result + url.pathname + url.search + url.hash;
}

function detect(rawURL) {
  var properties = {
    "secure": false,
    "schema_relative": false,
    "relative": false
  };  
  properties.raw = rawURL;
  
  if (rawURL.indexOf("https://") != -1) {
    properties.secure = true;
  } else if(rawURL.indexOf("http://") == -1) {
    if (rawURL.indexOf("//") == 0) {
      properties.schema_relative = true;
    } else {
      properties.relative = true;
    }
  }
  
  return properties;
}

function denormalize(url, properties) {
  url = getParsedURL(url);
  if (properties.relative) {    
    return url.pathname + url.search + url.hash;
  } else {
    if (properties.secure) {
      return url.href.replace("http://","https://");
    } 
    if (properties.schema_relative) {
      return url.href.replace(/^https*:/, "");
    }
    
  }
  return url.href;
}

mw.proxyURLToOrigin = function(rawURL){	

	var properties = detect(rawURL);

	// Make sure it includes the host, or it will still be proxied!
	properties.relative = false;

	var url = getParsedURL(rawURL);
	var catch_all = detect_catch_all(url);

  if (catch_all) {    
	  url = strip_catch_all(url);
  }
	
	url = fetch(url, mapProxyToOrigin);
	url = denormalize(url, properties);

	return url;
}

mw.originURLToProxy = function(rawURL){

	var properties = detect(rawURL);
	var url = getParsedURL(rawURL);
	var catch_all = detect_catch_all(url);

  if (catch_all) {    
	  url = strip_catch_all(url);
  }

  url = getParsedURL(fetch(url, mapOriginToProxy));
  var globalLocation = getParsedURL(window.location.href);
  if (detect_catch_all(globalLocation)) {
      url = add_catch_all(url);
  }

	url = denormalize(url.href, properties);
	
	return url;
}

}());



/*
 * File: http://downloads.moovweb.com/plutonium/0.1.95/passthrough_ajax.js
 */
/* * * * * * * * * * * 
 * Tritium usage:
 * 1 - Add this script, and gsub script
 * 2 - Add an element on the page to configure the replacement:
 * 
     insert("div") {
       attribute("id", "mw_link_passthrough_config")
       attribute("rewrite_link_matcher", $rewrite_link_matcher)
       attribute("rewrite_link_replacement", $rewrite_link_replacement)
     }
 * 
 * 
 */

(function(){

    var matcher = null;
    var replace = null;

    function get_config(config_element) {
        var raw_matcher = config_element.getAttribute("rewrite_link_matcher");
				if (raw_matcher !== null) {
        	matcher = new RegExp(raw_matcher, "g");
				}

        replace = config_element.getAttribute("rewrite_link_replacement");
    }

		function normalize_host(host) {
			if (host[host.length-1] == "/") {
				host = host.slice(0,host.length-1);
			}
			return host;
		}	

		function split_schema_and_host(schema_and_host) {
			parts = schema_and_host.split("//");
			schema = parts[0];
			host = parts[1];
			return {
				"schema" : schema + "//",
				"host" : normalize_host(host)
			}
		}
			
		// Splits into schema / host / path			
		function url_components(url) {
			length = url.length;
			var previous = "";
			var found_slash = false;
			
			for(var i=0; i < length; i++) {
				if (url[i] == "/") {
					if (previous != "/" && found_slash) {
						path = url.slice(i+1, length);
						parts = split_schema_and_host(url.slice(0, i+1));

						return {
							"schema" : parts.schema,
							"host" : parts.host,							
							"path" : path							
						}
					} else {
						found_slash = false;
					}
					
					found_slash = true;					
				}
				previous = url[i];
			}
			
			// Never found the start of path ... the whole thing is the 'host' part
			parts = split_schema_and_host(url);
			
			return {
				"schema" : parts.schema,
				"host" : parts.host,							
				"path" : ""							
			}			
			
		}


    function passthrough_url(url) {
      var temp_url = url;
      var config_element = document.getElementById('mw_link_passthrough_config');  
			var use_host_map = false;


      if (config_element !== null) {
        if (!matcher && !replace) {
          get_config(config_element);
        }

				if (!matcher && !replace) {
					use_host_map = true;
				} else {
        	temp_url = gsub(url, matcher, replace);
				}
      } else {
				return mw.originURLToProxy(url);
			}
			
      return temp_url;
    }


    function hijack_open(method, url, some_boolean) {
        var new_url = passthrough_url(url);
        this._open(method, new_url, some_boolean);

        // Semi-standard header used by tritium to differentiate Ajax requests from regular page requests
        if (this._headers && !this._headers["X-Requested-With"])
          this.setRequestHeader("X-Requested-With", "XMLHttpRequest")

    }

    if (XMLHttpRequest)
    {
        XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = hijack_open;
    } else if (ActiveXObject)
    {
        ActiveXObject.prototype._open = ActiveXObject.prototype.open;
        ActiveXObject.prototype.open = hijack_open;
    }

})();



/*
 * File: head/stub.js
 */
// Delete me when ready
