"use strict"

const app = require("express").Router();
const hdbext = require("@sap/hdbext");

module.exports = function() {
	var db;
	function callProcedure(procedureName, data, db, res) {
		if (procedureName !== 'caremonger.caremonger_db::p_get_processor_texts') {
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
			sp(data, function (err, paramsResults, tableResults) {
				if (err) {
					res
						.type("text/plain")
						.status(400)
						.send("ERROR: " + err.message.toString());
					return;
				}
				if(tableResults) {
					res.send(tableResults);					
				} else
				res.send(paramsResults);
			});
		});
	}

	app.get("/getProcessorTexts/:IN_ORDER_ID",(req,res) => {
		try {
			db = req.db;
			let order = req.params.IN_ORDER_ID;
			let procedureName = "caremonger.caremonger_db::p_get_processor_texts";
			callProcedure(procedureName, order, db, res);
		} catch(err) {
			console.log(err);
		}
	});
	
	app.post("/createProcessor",(req,res) => {
		try {
			db = req.db;
			let order = req.readableBuffer._getBuffer(req.readableLength).toString();
			let procedureName = "caremonger.caremonger_db::p_create_processor";
			callProcedure(procedureName, order, db, res);
		} catch(err) {
			console.log(err);
		}
	});
	
	app.post("/assignProcessor",(req,res) => {
		try {
			db = req.db;
			let order = req.readableBuffer._getBuffer(req.readableLength).toString();
			let procedureName = "caremonger.caremonger_db::p_assign_processor";
			callProcedure(procedureName, order, db, res);			
		} catch(err) {
			console.log(err);
		}
	});
	return app;
}
