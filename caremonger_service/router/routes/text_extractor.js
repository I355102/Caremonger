"use strict"

const xsenv = require("@sap/xsenv");
const express = require("express");
const app = express.Router();
const request = require('superagent');
const hdbext = require("@sap/hdbext");

module.exports = function() {
	var db;
	function createOrders(orders, res) {
		var client = db;
		hdbext.loadProcedure(client, null, "caremonger.caremonger_db::p_create_order", function (err, sp) {
			if (err) {
				res
					.type("text/plain")
					.status(500)
					.send("ERROR: " + err.toString());
				return;
			}
			sp(orders, function (err, results) {
				if (err) {
					res
						.type("text/plain")
						.status(400)
						.send("ERROR: " + err.message.toString());
					return;
				}
				res.send(results);
			});
		});
	}
	

	app.post("/createOrders", (req,res) => {
		try {
			let cai_credentials = xsenv.getServices({ cai: {  name: "CAI_TEXT_ANALYZER" } }).cai;
			
			let url = cai_credentials.url + 'train/v2/request';
			db = req.db;
			
			let errorOcc;
			let index;
			
			if(req.readableLength === 0) {
				res
				.type("text/plain")
				.status(400)
				.send("ERROR: Input is empty");
				return;
			}

			let body = req.readableBuffer._getBuffer(req.readableLength).toString();
			// console.log("This is body: " + body);
			let data = JSON.parse("["+(("["+body.replace(/\"{\"/g,",{")+"]").replace(/\"}\"/g,"}").replace(/,{/,"{").replace(/"\r"/,"").replace(/\":\"/g,':')).substr(2,));
				
		 	let orderInput = [];
			var errorInInput = 0;
			
			async function getOrderInput() { 
				let response = await request
					  .post(url)
					  .send(data[0])
					  .set('Authorization', cai_credentials.developerToken);
				let currentOutput = response.body.results.entities;
		  		let orderCurrentInput = {};
		  		if(currentOutput.hasOwnProperty("name")) {
		  	  		orderCurrentInput["REQUESTER_NAME"] = currentOutput.name.sort((a,b) => b.confidence - a.confidence)[0].raw;
		  		} else {
					orderCurrentInput["REQUESTER_NAME"] = '';
		  		}
		  		
		  		if(currentOutput.hasOwnProperty("number")) {
			  		orderCurrentInput["REQUESTER_PHONE_NUMBER"] = currentOutput.number.sort((a,b) => b.confidence - a.confidence)[0].raw;
		  		} else {
					errorInInput = 1;
		  		}
		  		
		  		if(currentOutput.hasOwnProperty("location")) {
			  		orderCurrentInput["REQUESTER_LOCATION"] = currentOutput.location.sort((a,b) => b.confidence - a.confidence)[0].raw;
		  		} else {
		  			errorInInput = 1;
		  		}
		  		
		  		if(currentOutput.hasOwnProperty("priority")) {
			  		orderCurrentInput["CRITICALITY"] = "High";
		  		} else {
		  			orderCurrentInput["CRITICALITY"] = "Medium";
		  		}
		  		
		  		if(currentOutput.hasOwnProperty("need")) {
			  		orderCurrentInput["REQUEST_TYPE"] = currentOutput.need.sort((a,b) => b.confidence - a.confidence)[0].raw;;
		  		} else {
		  			errorInInput = 1;
		  		}
		  		
		  		orderCurrentInput["REQUEST_DESCRIPTION"] = data[0].text.substr(11,);
		  
		  		if(errorInInput === 0) {
		  			orderInput.push(orderCurrentInput);
		  		} else {
					res
					.type("text/plain")
					.status(500)
					.send("ERROR: Please provide correct input");
					return; 			
		  		}
		  		return orderInput;
			}
			
			getOrderInput().then(input=> {
				if(errorInInput === 0){
					createOrders(orderInput, res);
				}
			}).catch(err => {
				console.log(err);
			});
		}
		catch(err) {
			console.log("Error occurred: " + err);
			res
					.type("text/plain")
					.status(400)
					.send("ERROR: Please provide correct input");
		}
	});
	return app;
}
//module.exports = app;