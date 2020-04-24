function createOrder(order) {
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(order);
	var fnCreate = conn.loadProcedure("caremonger.caremonger_db::p_create_order");
	
	var result = fnCreate({REQUESTER_NAME: order.REQUESTER_NAME, REQUESTER_PHONE_NUMBER: order.REQUESTER_PHONE_NUMBER , REQUEST_DESCRIPTION: order.REQUEST_DESCRIPTION ,
		REQUEST_TYPE: order.REQUEST_TYPE , REQUESTER_LOCATION: order.REQUESTER_LOCATION , REQUEST_TIME: order.REQUEST_TIME , CRITICALITY: order. CRITICALITY, 
		REQUEST_STATUS: 'Not assigned'});
		
	conn.commit();
	conn.close();
	
	if(result){
		console.log("Order creation successful");
		return {body: result, status: $.net.http.CREATED}; 
	} else {
		console.log("Order creation failed");
		return {body: result, status: $.net.http.BAD_REQUEST};
	}
}

function updateRequestStatus(order) {
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(order);
	var fnCreate = conn.loadProcedure("caremonger.caremonger_db::p_update_request_status");
	
	var result = fnCreate({ORDER_ID: order.ORDER_ID, REQUEST_STATUS: order.REQUEST_STATUS});
		
	conn.commit();
	conn.close();

	if(result){
		console.log("Request status update successful");
		return {body: result, status: $.net.http.CREATED}; 
	} else {
		console.log("Request status update failed");
		return {body: result, status: $.net.http.BAD_REQUEST}; 		
	}
	
}

function updateProcessorText(order) {
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(order);
	var fnCreate = conn.loadProcedure("caremonger.caremonger_db::p_update_processor_text");
	
	var result = fnCreate({ORDER_ID: order.ORDER_ID, PROCESSOR_ID: order.PROCESSOR_ID, PROCESSOR_TEXT: order.PROCESSOR_TEXT});
		
	conn.commit();
	conn.close();

	if(result){
		console.log("Processor text update successful");
		return {body: result, status: $.net.http.CREATED}; 
	} else {
		console.log("Processor text update failed");
		return {body: result, status: $.net.http.BAD_REQUEST}; 
	}
	
}

function updateCriticality(order) {
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(order);
	var fnCreate = conn.loadProcedure("caremonger.caremonger_db::p_update_criticality");
	
	var result = fnCreate({ORDER_ID: order.ORDER_ID, CRITICALITY: order.CRITICALITY});
		
	conn.commit();
	conn.close();

	if(result){
		console.log("Order criticality update successful");
		return {body: result, status: $.net.http.CREATED}; 
	} else {
		console.log("Order criticality update failed");
		return {body: result, status: $.net.http.BAD_REQUEST}; 
	}
	
}

var body = $.request.body.asString();
console.log("This is body: " + body);
var payload = JSON.parse(body);
var callingFunc = $.request.parameters.get("raw");
var output;
if(callingFunc === 'createOrder') {
	output = createOrder(payload);
} else if(callingFunc === 'updateRequestStatus') {
	output = updateRequestStatus(payload);
} else if(callingFunc === 'updateProcessorText') {
	output = updateProcessorText(payload);
} else if(callingFunc === 'updateCriticality') {
	output = updateCriticality(payload);
} else {
	console.log("Wrong call!");
	output = {body: {}, status: $.net.http.BAD_REQUEST}; 
}
$.response.contentType = "application/json";
$.response.setBody(output.body);
$.response.status = output.status;
