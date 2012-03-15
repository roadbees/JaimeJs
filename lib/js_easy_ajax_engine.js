/**
 *
 * Js Easy Ajax Markup Engine
 *
 * builds automaticly a complete ajax app with just a view html attributes
 * and some custom Javascript function
 *
 * @author Nicolas Traeder <nicolas@roadbee.de>
 * @license MIT 2012 Nicolas Traeder
 * 
 */
var JsRenderEngineDebug = {};

var JsRenderEngine = (function() {
	
	var _findHTMLElements = function(parent) {
		window.JsRenderEngineDebug.countElements = 0;
		
		if(!parent) parent = "body";				
		
		// $('*[data-action]',parent).each(function(i){
		// 	window.JsRenderEngineDebug.countElements++;
		// 	//console.log(this.id);
			
		// 	var elementDataAttr = {
		// 			"_action" : this.attributes.getNamedItem('data-action').value,
		// 			"_function" : (this.attributes.getNamedItem('data-function') != null) ? this.attributes.getNamedItem('data-function').value  : undefined,
		// 			"_request" : (this.attributes.getNamedItem('data-request') != null) ? this.attributes.getNamedItem('data-request').value  : undefined,
		// 			"_target" : (this.attributes.getNamedItem('data-target') != null) ? this.attributes.getNamedItem('data-target').value  : undefined,
		// 			"_callback" : (this.attributes.getNamedItem('data-callback') != null) ? this.attributes.getNamedItem('data-callback').value  : undefined,
		// 			"_type" : (this.attributes.getNamedItem('data-type') != null) ? this.attributes.getNamedItem('data-type').value  : "GET"
		// 		}
			
		// 	//console.log(elementDataAttr);			
		// 	//switch through the actions
		// 	switch(elementDataAttr._action) {
		// 		case "submit":
					
		// 			elementDataAttr._type = "POST";
		// 			elementDataAttr._request = $(this).attr('action');
					
		// 			$(this).submit(function(){								 
		// 				var _data = $(this).serializeArray();
						
		// 				$.ajax({
		// 					"url" : elementDataAttr._request,
		// 					"data" : _data,
		// 					'type' : elementDataAttr._type,
		// 					'success' : function(data) {
		// 							var _obj = $(data);
		// 							ViewFunctions[elementDataAttr._callback](_obj);
		// 							_findHTMLElements(_obj);
		// 					}
		// 				})
						
		// 				return false;
						
		// 			});					
		// 		break;
				
		// 		case "load":
		// 			ViewFunctions[elementDataAttr._function]();
		// 		break;
			
		// 		case "hover":
					
		// 		break;
			
		// 		default:
		// 			//click, dblclick, change, ...					
		// 			_bindActionToHTMLElement(this,{
		// 				"event" : elementDataAttr._action,								
		// 				"target" : elementDataAttr._target,
		// 				"request" : elementDataAttr._request,
		// 				'type' : elementDataAttr._type,
		// 				"callback" : elementDataAttr._callback,
		// 				"func" : elementDataAttr._function
		// 				}
		// 			);
					
		// 		break;
		// 	}
		// });
		// 
	
		/**
		 * bind the onLoad Event		 
		 */
		$('*[data-action=load]').each(function(){
			
			var _attr = this.attributes;
			
			if(_attr.getNamedItem('data-function')!=null){			
				ViewFunctions[_attr.getNamedItem('data-function').value]();
				return void(0);
			}

		});

		/**
		 * bind the onClick Event		 
		 */
		$('*[data-action=click]',parent).on('click',function(){

			var _attr = this.attributes;
			
			if(_attr.getNamedItem('data-function')!=null){
				console.log(_attr.getNamedItem('data-function'));
				ViewFunctions[_attr.getNamedItem('data-function').value]();
				return void(0);
			}

			if(_attr.getNamedItem('data-request')!=null) {
				console.log("do request");

				var _requestType = (this.attributes.getNamedItem('data-type') != null) ? this.attributes.getNamedItem('data-type').value  : "GET";

				if(_attr.getNamedItem('data-callback')!=null) {

					console.log("data-callback request");

					_doAJAXRequest(_requestType,_attr.getNamedItem('data-request').value,undefined,ViewFunctions[_attr.getNamedItem('data-callback').value]);

				} 

				if(_attr.getNamedItem('data-target')!=null) {
					_doAJAXRequest(_requestType,_attr.getNamedItem('data-request').value,undefined,function(data){

						$(_attr.getNamedItem('data-placeholder').value).html(data);

					});					
				}

				if(_attr.getNamedItem('data-placeholder')!=null) {

					_doAJAXRequest(_requestType,_attr.getNamedItem('data-request').value,undefined,function(data){
						console.log("start replace");
						if($(data).length > 0 && $(data)[0].tagName != undefined ) {
							//no html data							
							$(_attr.getNamedItem('data-placeholder').value).replaceWith(data);
						} else {
							$(_attr.getNamedItem('data-placeholder').value).replaceWith("<span>"+data+"</span>");
						}


					});


					
				}
			}		

		});

		/**
		 * bind the chnage Event		 
		 */
		$(':input[data-action=change]'
			,parent).on('change',function(){

				console.log(this.tagName+' '+this.name);

		});

		
	}

	/**
	 * does the Ajax Request
	 * @param  {string}   type     the request type
	 * @param  {string}   url      the request url
	 * @param  {string}   data     the request data (optional)
	 * @param  {Function} callback the success callback function	 
	 */
	
	var _doAJAXRequest = function(type,url,data,callback) {

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

		console.log("request", JSON.stringify(_requestAJAXJson));

		$.ajax(_requestAJAXJson);
	}
	
	var _bindActionToHTMLElement = function(ele,action) {
		
		if(action.func){
			//action mit function
			$(ele).bind(action.event,ViewFunctions[action.func]);
			
		} else if(action.request && action.callback) {
			//action mit request & callback
			$(ele).bind(action.event,function() {
				//type fehlt noch
				
				if(action.type == "JSONP") {					
					$.ajax({
						"dataType": 'jsonp',				
						"url": action.request,
						"success" : ViewFunctions[action.callback],
					});					
				} else { 								
					$.get(action.request,function(data){
						var _obj = $(data);
						if(_obj.length > 0) {
							ViewFunctions[action.callback](_obj);
							_findHTMLElements(_obj);	
						} else {
							ViewFunctions[action.callback](data);
						}
						
					});
				}
			});
			
		} else if(action.request && action.target)  {
			//action mit request & target
			$(ele).bind(action.event,function() {
				console.log(action);
	
				$.get(action.request,function(data) {
					if($(action.target).length > 0) {
						$(action.target).html(data);
					} else {
						$('#'+action.target).html(data);
					}
				});
				
				
			});
		} else {
			console.error('No Right Data-Attribute set');
			return false;
		}
		

	}

return {
	
	"init" : function()		 {
		_findHTMLElements();
	}

}
})();	