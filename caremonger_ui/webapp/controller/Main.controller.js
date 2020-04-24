sap.ui.define([
	"caremonger/caremonger_ui/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController,Controller,Filter,FilterOperator) {
	"use strict";

	return BaseController.extend("caremonger.caremonger_ui.controller.Main", {
		onInit: function () {
			debugger;
			var oModel = new sap.ui.model.odata.ODataModel("https://lvhmfpf6jpgn677waremonger-service.cfapps.eu10.hana.ondemand.com/odata.xsodata", true);
			var jModel = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(jModel, "TableData");
	     	this.getView().setModel(oModel);
			oModel.read("/order_details", {
           
             success: function(oData){
                         
                         var model1 = this.getView().getModel("TableData");
                         model1.setData(oData);
                         this.getView().setModel(model1, "TableData");
                      }.bind(this)
            });
            
		},
		
		_showObject : function (oItem) {
			this.getRouter().navTo("object");
			
		
			
		},
		
		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("TableData");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},
		
		onSearch : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("Requester_name", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},
		
		onPress : function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		}
		
	});
});