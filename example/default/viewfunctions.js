var ViewFunctions = {
	
	"makeItRed" : function() {		
		$("#first-text").css('color','red');		
	},

	"makeItBlue" : function() {		
		$("#first-text").css('color','blue');		
	},
	
	"twitterCallback" : function(data) {
		$('#twitter-target').html(JSON.stringify(data));
	},

	"afterSubmit" : function(data) {
		console.log("in afterSubmit" + data);
	}


	
}
