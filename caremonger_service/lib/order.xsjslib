function init() {
	var body = $.request.body.asString();
	console.log("This is body: " + body);
	var payload = JSON.parse(body);
	return payload;
}

function sendResponse(output) {
	$.response.contentType = "application/json";
	$.response.setBody(output.body);
	$.response.status = output.status;	
}

function createOrder(orders) {
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(orders);
	var fnCreate = conn.loadProcedure("caremonger.caremonger_db::p_create_order");
	
	var result = fnCreate(orders);
		
	conn.commit();
	conn.close();
	
	var returnObject;
	if(result){
		console.log("Order creation successful");
		returnObject = {body: result, status: $.net.http.CREATED}; 
	} else {
		console.log("Order creation failed");
		returnObject = {body: result, status: $.net.http.BAD_REQUEST};
	}
}

function updateRequestStatus() {
	order = init();
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(order);
	var fnCreate = conn.loadProcedure("caremonger.caremonger_db::p_update_request_status");
	
	var result = fnCreate({ORDER_ID: order.ORDER_ID, REQUEST_STATUS: order.REQUEST_STATUS});
		
	conn.commit();
	conn.close();

	if(result){
		console.log("Request status update successful");
		returnObject = {body: result, status: $.net.http.CREATED}; 
	} else {
		console.log("Request status update failed");
		returnObject = {body: result, status: $.net.http.BAD_REQUEST}; 		
	}
	sendResponse(returnObject);
}

function updateProcessorText() {
	order = init();
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(order);
	var fnCreate = conn.loadProcedure("caremonger.caremonger_db::p_update_processor_text");
	
	var result = fnCreate({ORDER_ID: order.ORDER_ID, PROCESSOR_ID: order.PROCESSOR_ID, PROCESSOR_TEXT: order.PROCESSOR_TEXT});
		
	conn.commit();
	conn.close();

	if(result){
		console.log("Processor text update successful");
		returnObject = {body: result, status: $.net.http.CREATED}; 
	} else {
		console.log("Processor text update failed");
		returnObject = {body: result, status: $.net.http.BAD_REQUEST}; 
	}
	sendResponse(returnObject);
}

function updateCriticality() {
	order = init();
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(order);
	var fnCreate = conn.loadProcedure("caremonger.caremonger_db::p_update_criticality");
	
	var result = fnCreate({ORDER_ID: order.ORDER_ID, CRITICALITY: order.CRITICALITY});
		
	conn.commit();
	conn.close();

	if(result){
		console.log("Order criticality update successful");
		returnObject = {body: result, status: $.net.http.CREATED}; 
	} else {
		console.log("Order criticality update failed");
		returnObject = {body: result, status: $.net.http.BAD_REQUEST}; 
	}
	sendResponse(returnObject); 
}