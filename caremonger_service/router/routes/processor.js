"use strict"

const app = require("express").Router();
const hdbext = require("@sap/hdbext");

module.exports = function() {
	var db;
	function callProcedure(procedureName, data, db, res) {
		data = JSON.parse(data);
		var client = db;
		hdbext.loadProcedure(client, null, procedureName, function (err, sp) {
			if (err) {
				res
					.type("text/plain")
					.status(500)
					.send("ERROR: " + err.toString());
				return;
			}
			sp(data, function (err, results) {
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
