/**
 *
 * Js Easy Ajax Markup Engine
 *
 * builds automatically a complete ajax based App with just a few html attributes
 * and some custom Javascript function
 *
 * @author Nicolas Traeder <nicolas@roadbee.de>
 * @license MIT 2012 Nicolas Traeder
 * 
 */
var JsRenderEngineDebug = {};

var JsRenderEngine = (function() {
	
	var _findHTMLElements = function(parent,returnJqObj) {
		window.JsRenderEngineDebug.countElements = 0;
		
		parent = parent ? $(parent) : "body";							
	
		/**
		 * bind the onLoad Event		 
		 */
		$('*[data-action="load"]',parent).each(function(){
			
			var _attr = this.attributes;
			
			if(_attr.getNamedItem('data-function')!=null){			
				ViewFunctions[_attr.getNamedItem('data-function').value]();
				return void(0);
			}

		});

		/**
		 * bind the onClick Event		 
		 */
		$('*[data-action="click"]',parent).on('click',function(){			
				_executeAction(this);

		});

		/**
		 * bind the onClick Event		 
		 */
		$('*[data-action="dblclick"]',parent).on('dblclick',function(){
				_executeAction(this);
		});


		/**
		 * bind the chnage Event		 
		 */
		$(':input[data-action=change]',parent).on('change',function(){
				_executeAction(this);
		});


		/**
		 * bind the submit Event to forms
		 */
		$('form[data-action="submit"]',parent).on('submit',function(){
			
				var _requestUrl = $(this).attr('action').toString(),
					_requestType = $(this).attr('method').toString();				
				
				if(this.attributes.getNamedItem('data-callback')!=null) { 

					var _formData = $(this).serializeArray();
					_doAJAXRequest(_requestType,undefined,_requestUrl,_formData,ViewFunctions[this.attributes.getNamedItem('data-callback').value])
					
					return false;
				} else {
					console.error('Error - Submit needs a callback function');
				}

				return false;

		});

		if (returnJqObj === true)
			return parent;
		
	}

	/**
	 * does the Ajax Request
	 * @param  {string}   type     the request type
	 * @param  {string}   url      the request url
	 * @param  {string}   data     the request data (optional)
	 * @param  {Function} callback the success callback function	 
	 */
	
	var _doAJAXRequest = function(type,datatype,url,data,callback) {

		if(callback==undefined || url==undefined || type==undefined ) {
			console.error("AJAX Request Error: Not enough parameter set!");
			return false;
		}

		var _requestAJAXJson = {
			"type" : type,
			"url" : url,
			"success" : callback
		};

		if(data) {
			_requestAJAXJson['data'] = data;
		}

		if(type=== "JSONP")
			_requestAJAXJson['dataType'] = type;
			
		if(datatype == "JAIMEJSON") {		
			_requestAJAXJson['dataType'] = "JSON";
		}

		window.JsRenderEngineDebug["lastRequest"] = JSON.stringify(_requestAJAXJson);

		$.ajax(_requestAJAXJson);
	}
	
	/**
	 * executs the action
	 * 
	 * @param  {DOM Object} _this the html DOM object	 
	 */
	var _executeAction = function(_this) {
		
		var _attr = _this.attributes;

		JsRenderEngineDebug['lastElementAttr'] = _attr;			
			
		if(_attr.getNamedItem('data-function')!=null){		
			//console.log(_attr.getNamedItem('data-function').value);
			ViewFunctions[_attr.getNamedItem('data-function').value]();
			return void(0);
		}

		if(_attr.getNamedItem('data-request')!=null) {
			//console.log("do request");

			var _requestType = (_this.attributes.getNamedItem('data-type') != null) ? _this.attributes.getNamedItem('data-type').value  : "GET";
			var _requestDatatype = (_this.attributes.getNamedItem('data-datatype') != null) ? _this.attributes.getNamedItem('data-datatype').value  : "NULL";

			if(_attr.getNamedItem('data-callback')!=null) {

				console.log("data-callback request");

				_doAJAXRequest(_requestType,_requestDatatype,_attr.getNamedItem('data-request').value,undefined,function(data){
					if(_requestDatatype === "JAIMEJSON") {											
						data.html = _findHTMLElements(data.html,true);							
						ViewFunctions[_attr.getNamedItem('data-callback').value](data);				
					} else {
						var jqObjOrData = _checkAndBindSingleElement(data);
						ViewFunctions[_attr.getNamedItem('data-callback').value](jqObjOrData);
					}
					
				});

			} 

			if(_attr.getNamedItem('data-target')!=null) {
				_doAJAXRequest(_requestType,undefined,_attr.getNamedItem('data-request').value,undefined,function(data){
					console.log("target "+_attr.getNamedItem('data-target').value );
					var jqObjOrData = _checkAndBindSingleElement(data);
					$(_attr.getNamedItem('data-target').value).html(jqObjOrData);

				});					
			}

			if(_attr.getNamedItem('data-placeholder')!=null) {

				_doAJAXRequest(_requestType,undefined,_attr.getNamedItem('data-request').value,undefined,function(data){												
					var jqObjOrData = _checkAndBindSingleElement(data);				
					if(window.JsRenderEngineDebug["SingleElement"] === "HTML") {																	
						$(_attr.getNamedItem('data-placeholder').value).replaceWith(jqObjOrData);
					} else {					
						$(_attr.getNamedItem('data-placeholder').value).replaceWith(jqObjOrData);
					}


				});


				
			}
		}	
		

	}
	/**
	 * check if the return data chunk has some data- attributes set
	 * @param  {data} data the return request data
	 * @return {data/JqueryObject}
	 */
	var _checkAndBindSingleElement = function(data) {		
		if($(data).length > 0 && $(data)[0].tagName != undefined ) {
			window.JsRenderEngineDebug["SingleElement"] = "HTML";
			return _findHTMLElements(data,true);
		} else if($(data).length > 0 && $(data)[0].tagName == undefined ) {
			window.JsRenderEngineDebug["SingleElement"] = "JQUERY";
			return JSON.stringify(data);
		} else {
			window.JsRenderEngineDebug["SingleElement"] = "PLAIN";
			return data;
		}

	}

	return {
	
		"init" : function()	{
			_findHTMLElements();
		}

	}
})();	