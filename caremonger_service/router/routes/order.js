"use strict"

const app = require("express").Router();
const hdbext = require("@sap/hdbext");

module.exports = function() {
	var db;
	function callProcedure(procedureName, data, db, res) {
		if (procedureName !== 'caremonger.caremonger_db::p_get_orders') {
			data = JSON.parse(data);
		} 
		var client = db;
		hdbext.loadProcedure(client, null, procedureName, function (err, sp) {
			if (err) {
				res
					.type("text/plain")
					.status(500)
					.send("ERROR: " + err.toString());
				return;
			}
			sp(data, function (err, parameterResults, tableRowsResults) {
				if (err) {
					res
						.type("text/plain")
						.status(400)
						.send("ERROR: " + err.message.toString());
					return;
				}
				if(!tableRowsResults) {
					res.send(parameterResults);
				}
				else {
					res.send(tableRowsResults);
				}
			});
		});
	}
	
	app.get("/getOrders", (req, res) => {
		try {
			db = req.db;
			let order = {};
			let procedureName = "caremonger.caremonger_db::p_get_orders";
			callProcedure(procedureName, order, db, res);			
		} catch(err) {
			console.log(err);
			res
				.type("text/plain")
				.status(400)
				.send(err);
		}
	})
	
	app.post("/createOrder",(req,res) => {
		try {
			db = req.db;
			let order = req.readableBuffer._getBuffer(req.readableLength).toString();
			let procedureName = "caremonger.caremonger_db::p_create_order";
			callProcedure(procedureName, order, db, res);
		} catch(err) {
			console.log(err);
		}
	});
	
	app.post("/updateRequestStatus",(req,res) => {
		try {
			db = req.db;
			let order = req.readableBuffer._getBuffer(req.readableLength).toString();
			let procedureName = "caremonger.caremonger_db::p_update_request_status";
			callProcedure(procedureName, order, db, res);			
		} catch(err) {
			console.log(err);
		}
	});
	
	app.post("/updateProcessorText",(req,res) => {
		try {
			db = req.db;
			let order = req.readableBuffer._getBuffer(req.readableLength).toString();
			let procedureName = "caremonger.caremonger_db::p_update_processor_text";
			callProcedure(procedureName, order, db, res);			
		} catch(err) {
			console.log(err);
		}
	});
	
	app.post("/updateCriticality",(req,res) => {
		try {
			db = req.db;
			let order = req.readableBuffer._getBuffer(req.readableLength).toString();
			let procedureName = "caremonger.caremonger_db::p_update_criticality";
			callProcedure(procedureName, order, db, res);			
		} catch(err) {
			console.log(err);
		}
	});
	return app;
}