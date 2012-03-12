var ViewFunctions = {
	
	"makeItRed" : function() {		
		$("#first-text").css('color','red');		
	},
	
	"twitterCallback" : function(data) {
		$('#twitter-target').html(JSON.stringify(data));
	}
	
}
