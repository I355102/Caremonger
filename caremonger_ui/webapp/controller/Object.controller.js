sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (
	BaseController, JSONModel, History, formatter, DateFormat, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("caremonger.caremonger_ui.controller.Object", {

				getFilteredData: function(oData,sKey)			
				{
					var arr = [];
				
					var res = oData.results;
						for ( var i=0;i<res.length;i++)
						{
							if (res[i].REQUESTER_NAME == sKey)
							arr.push(res[i]);
						}
						return {results : arr};
					
				},
			
	
		onInit: function (oEvent) {

			this.sid = null;
			//this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			var oModel = new sap.ui.model.odata.ODataModel("https://1q01ntccb0ionnvuaremonger-service.cfapps.eu10.hana.ondemand.com/odata.xsodata", true);
			var jModel = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(jModel, "TableData2");
	     	this.getView().setModel(oModel);
	     	debugger;
	     	this.getView().byId("combo").setSelectedKey("New");          
	     	
	     	
	     	
		},
			toggleEnabled: function () {
			var oModel = this.getView().getModel(),
				oData = oModel.getData();

			oData.Enabled = !oData.Enabled;
			oModel.setData(oData);
		},
				
		_onObjectMatched : function (oEvent) {
		
			
		},
	
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("main", {}, true);
			}
		},

	
		onPost: function (oEvent) {
		    var today = new Date();
			var sValue = oEvent.getParameter("value");
			var oEntry = {
				productID: "Lokesh",
				type: "Lokesh",
				date: today,
				comment: sValue
			};
			// update model
			var oFeedbackModel = this.getModel("productFeedback");
			var aEntries = oFeedbackModel.getData().productComments;
			aEntries.push(oEntry);
			oFeedbackModel.setData({
				productComments : aEntries
			});
		}

	});

});
























