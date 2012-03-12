/**
 *
 * Js Easy Ajax Markup Engine
 *
 * build automatily a compelte ajax app with just a view html attributes and some custom Javascript function
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
		
		$('*[data-action]',parent).each(function(i){
			window.JsRenderEngineDebug.countElements++;
			//console.log(this.id);
			
			var elementDataAttr = {
					"_action" : this.attributes.getNamedItem('data-action').value,
					"_function" : (this.attributes.getNamedItem('data-function') != null) ? this.attributes.getNamedItem('data-function').value  : undefined,
					"_request" : (this.attributes.getNamedItem('data-request') != null) ? this.attributes.getNamedItem('data-request').value  : undefined,
					"_target" : (this.attributes.getNamedItem('data-target') != null) ? this.attributes.getNamedItem('data-target').value  : undefined,
					"_callback" : (this.attributes.getNamedItem('data-callback') != null) ? this.attributes.getNamedItem('data-callback').value  : undefined,
					"_type" : (this.attributes.getNamedItem('data-type') != null) ? this.attributes.getNamedItem('data-type').value  : "GET"
				}
			
			//console.log(elementDataAttr);			
			//switch through the actions
			switch(elementDataAttr._action) {
				case "submit":
					
					elementDataAttr._type = "POST";
					elementDataAttr._request = $(this).attr('action');
					
					$(this).submit(function(){								 
						var _data = $(this).serializeArray();
						
						$.ajax({
							"url" : elementDataAttr._request,
							"data" : _data,
							'type' : elementDataAttr._type,
							'success' : function(data) {
									var _obj = $(data);
									ViewFunctions[elementDataAttr._callback](_obj);
									_findHTMLElements(_obj);
							}
						})
						
						return false;
						
					});					
				break;
				
				case "load":
					ViewFunctions[elementDataAttr._function]();
				break;
			
				case "hover":
					
				break;
			
				default:
					//click, dblclick, change, ...					
					_bindActionToHTMLElement(this,{
						"event" : elementDataAttr._action,								
						"target" : elementDataAttr._target,
						"request" : elementDataAttr._request,
						'type' : elementDataAttr._type,
						"callback" : elementDataAttr._callback,
						"func" : elementDataAttr._function
						}
					);
					
				break;
			}
		});
		
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