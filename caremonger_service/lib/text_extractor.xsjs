const xsenv = $.require("@sap/xsenv");
const createOrder = $.import('/order.xsjslib').createOrder;

try {
	var cai_credentials = xsenv.getServices({ cai: {  name: "CAI_TEXT_ANALYZER" } }).cai;
	
	const request = $.require('superagent');
	var url = cai_credentials.url + 'train/v2/request';
	
	var errorCount = 0;
	var body = $.request.body.asString();
	// console.log("This is body: " + body);
	var data = JSON.parse("["+(("["+body.replace(/\"{\"/g,",{")+"]").replace(/\"}\"/g,"}").replace(/,{/,"{").replace(/"\r"/,"").replace(/\":\"/g,':')).substr(2,));
	
	function errorOccurred(error_message) {
	  	$.response.contentType = "application/json";
	  	$.response.setBody(error_message.toString());  
		$.response.status = $.net.http.BAD_REQUEST;   
		errorCount++;
	}

 	var orderInput = [];
	
	 function callTextAnalyzer() {
			request
			  .post(url)
			  .send(data[i])
			  .set('Authorization', cai_credentials.developerToken)
			  .end((err, res) => {
			  	if(err) {
			  		console.log(err);
					errorOccurred(err);
					return 1;
			  	}
			  	else {
			  		if(errorCount === 0){
				  		var currentOutput = res.body.results.entities;
				  		var orderCurrentInput = {};
				  		if(currentOutput.hasOwnProperty("name")) {
				  	  		orderCurrentInput["REQUESTER_NAME"] = currentOutput.name.sort((a,b) => b.confidence - a.confidence)[0].raw;
				  		} else {
							orderCurrentInput["REQUESTER_NAME"] = '';
				  		}
				  		
				  		if(currentOutput.hasOwnProperty("number")) {
					  		orderCurrentInput["REQUESTER_PHONE_NUMBER"] = currentOutput.number.sort((a,b) => b.confidence - a.confidence)[0].raw;
				  		} else {
							errorOccurred("No mobile number specified!");
				  		}
				  		
				  		if(currentOutput.hasOwnProperty("location")) {
					  		orderCurrentInput["REQUESTER_LOCATION"] = currentOutput.location.sort((a,b) => b.confidence - a.confidence)[0].raw;
				  		} else {
				  			errorOccurred("No location mentioned!");
				  		}
				  		
				  		if(currentOutput.hasOwnProperty("priority")) {
					  		orderCurrentInput["CRITICALITY"] = "High";
				  		} else {
				  			orderCurrentInput["CRITICALITY"] = "Medium";
				  		}
				  		
				  		if(currentOutput.hasOwnProperty("need")) {
					  		orderCurrentInput["REQUESTER_TYPE"] = currentOutput.need.sort((a,b) => b.confidence - a.confidence)[0].raw;;
				  		} else {
				  			errorOccurred("No need specified!");
				  		}
				  		
				  		orderCurrentInput["REQUESTER_DESCRIPTION"] = data[i];
				  		orderInput.push(orderCurrentInput);
				  	//	i++;
			  		}
			  		return 1;
			  	}
			});
		}
	
	(async() => {
		for(var i=0;i<data.length;i++) {
			await callTextAnalyzer(i); 			
		}
	})();
		
		if(orderInput.length === 0 && data.length !== 0) {
			$.response.contentType = "application/json";
			$.response.setBody("Required inputs not found!");
			$.response.status = $.net.http.BAD_REQUEST;		
		} else {
			var output = createOrder(orderInput);
			$.response.contentType = "application/json";
			$.response.setBody(output.body);
			$.response.status = output.status;
		}
	}
	catch(err) {
		console.log("Error occurred: " + err);
		$.response.contentType = "application/json";
		$.response.setBody("Internal error occurred!");
		$.response.status = $.net.http.BAD_REQUEST;	
	}
	
