sap.ui.define([
	"caremonger/caremonger_ui/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController,Controller,Filter,FilterOperator) {
	"use strict";

	return BaseController.extend("caremonger.caremonger_ui.controller.Main", {
		onInit: function () {
			var oModel = new sap.ui.model.odata.ODataModel("https://o9i5tfmc5quzicvfaremonger-service.cfapps.eu10.hana.ondemand.com/odata.xsodata", true);
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
		
		_showObject : function (oItem,title) {
			this.getRouter().navTo("object",{id:JSON.stringify(title)});
			
		
			
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
		
			getFilteredData: function(oData,sKey)			
				{
					var arr = [];
					if(sKey=="all")
					{
						return oData;
					}
					var res = oData.results;
						for ( var i=0;i<res.length;i++)
						{
							if (res[i].CRITICALITY == sKey)
							arr.push(res[i]);
						}
						return {results : arr};
					
				},		
			
			onQuickFilter: function(oEvent) {
				var oModel = new sap.ui.model.odata.ODataModel("https://o9i5tfmc5quzicvfaremonger-service.cfapps.eu10.hana.ondemand.com/odata.xsodata", true);
					var jModel = new sap.ui.model.json.JSONModel({});
					this.getView().setModel(jModel, "TableData");
				  	this.getView().setModel(oModel);
				
				var sKey = oEvent.getParameter("selectedKey");
				oModel.read("/order_details", {
	             success: function(oData){
	                     var resData = this.getFilteredData(oData,sKey);
	                     var model1 = this.getView().getModel("TableData");
                         model1.setData(resData);
                         this.getView().setModel(model1, "TableData");
                    	  }.bind(this)
						});    
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
			var title = oEvent.getSource().getCells()[0].getTitle();
			this._showObject(oEvent.getSource(),title);
		}
		
	});
});