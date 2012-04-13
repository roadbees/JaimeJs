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
var JaimeJsResult = {};

var JaimeJs = (function() {
	
	var _defaultOptions = {
		"beforeExecute" : undefined,
		"afterExecute" : undefined,
	}
	
	var _options = {}
	
	var _findHTMLElements = function() {
		
		parent = "body";							
	
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
		$(parent).on('click','*[data-action="click"]',function(){			
				_executeAction(this);
				return false;
		});

		/**
		 * bind the onClick Event		 
		 */
		$(parent).on('dblclick','*[data-action="dblclick"]',function(){
				_executeAction(this);
		});


		/**
		 * bind the chnage Event		 
		 */
		$(parent).on('change',':input[data-action=change]',function(){
				_executeAction(this);
		});


		/**
		 * bind the submit Event to forms
		 */
		$(parent).on('submit','form[data-action="submit"]',function(){
			
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

		if(data)
			_requestAJAXJson['data'] = data;
			
		if(datatype != undefined) 	
			_requestAJAXJson['dataType'] = datatype;
		
		if(type === "JSONP")
			_requestAJAXJson['dataType'] = type;

		window.JaimeJsResult["lastRequest"] = _requestAJAXJson;

		$.ajax(_requestAJAXJson);
	}
	
	/**
	 * executs the action
	 * 
	 * @param  {DOM Object} _this the html DOM object	 
	 */
	var _executeAction = function(_this) {
		
		var _attr = _this.attributes;

		JaimeJsResult['lastElementAttr'] = _attr;
		
		//trigger beforeExecute
		if(_options.beforeExecute && typeof _options.beforeExecute == "function") _options.beforeExecute();
			
		if(_attr.getNamedItem('data-function')!=null){		
			ViewFunctions[_attr.getNamedItem('data-function').value](_this);
		}

		if(_attr.getNamedItem('data-request')!=null) {			
			var _requestType = (_this.attributes.getNamedItem('data-type') != null) ? _this.attributes.getNamedItem('data-type').value  : "GET";
			var _requestDatatype = (_this.attributes.getNamedItem('data-datatype') != null) ? _this.attributes.getNamedItem('data-datatype').value  : undefined;

			if(_attr.getNamedItem('data-callback')!=null) {
				_doAJAXRequest(_requestType,_requestDatatype,_attr.getNamedItem('data-request').value,undefined,function(data){					
						ViewFunctions[_attr.getNamedItem('data-callback').value](data,_this);
				});
			} 

			if(_attr.getNamedItem('data-target')!=null) {
				_doAJAXRequest(_requestType,undefined,_attr.getNamedItem('data-request').value,undefined,function(data){					
					$(_attr.getNamedItem('data-target').value).html(data);
				});					
			}

			if(_attr.getNamedItem('data-placeholder')!=null) {
				_doAJAXRequest(_requestType,undefined,_attr.getNamedItem('data-request').value,undefined,function(data){																									
						$(_attr.getNamedItem('data-placeholder').value).replaceWith(data);
				});
			}
			
		}	
		
		//trigger beforeExecute
		if(_options.afterExecute && typeof _options.afterExecute == "function") _options.afterExecute();

	}

	return {
	
		"init" : function(options)	{
			
			_options = $.extend(_defaultOptions,options);
			
			_findHTMLElements();
		}

	}
})();	