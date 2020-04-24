function createProcessor(processor) {
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(processor);
	var fnCreate = conn.loadProcedure("caremonger.caremonger_db::p_create_processor");
	
	var result = fnCreate({FIRST_NAME: processor.FIRST_NAME, LAST_NAME: processor.LAST_NAME , MOBILE_NUMBER: processor.MOBILE_NUMBER ,
		ADDRESS: processor.ADDRESS , PIN_CODE: processor.PIN_CODE});
		
	conn.commit();
	conn.close();
	
	if(result){
		console.log("processor creation successful");
		return {body: result, status: $.net.http.CREATED}; 
	} else {
		console.log("processor creation failed");
		return {body: result, status: $.net.http.BAD_REQUEST};
	}
}

function assignProcessor(processor) {
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(processor);
	var fnAssign = conn.loadProcedure("caremonger.caremonger_db::p_assign_processor");

	var result = fnAssign({ORDER_ID: processor.ORDER_ID, PROCESSOR_ID: processor.PROCESSOR_ID});

	conn.commit();
	conn.close();
	
	if(result){
		console.log("processor assignment successful");
		return {body: result, status: $.net.http.CREATED}; 
	} else {
		console.log("processor assignment failed");
		return {body: result, status: $.net.http.BAD_REQUEST};
	}
}

var body = $.request.body.asString();
console.log("This is body: " + body);
var payload = JSON.parse(body);
var callingFunc = $.request.parameters.get("raw");
var output;
if(callingFunc === 'createProcessor') {
	output = createProcessor(payload);
} else if(callingFunc === 'assignProcessor') {
	output = assignProcessor(payload);
} else {
	console.log("Wrong call!");
	output = {body: {}, status: $.net.http.BAD_REQUEST}; 
}
$.response.contentType = "application/json";
$.response.setBody(output.body);
$.response.status = output.status;
