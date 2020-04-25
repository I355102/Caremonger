sap.ui.define([
	"caremonger/caremonger_ui/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController,Controller,Filter,FilterOperator) {
	"use strict";

	return BaseController.extend("caremonger.caremonger_ui.controller.Main", {
		onInit: function () {

			var oModel = new sap.ui.model.odata.ODataModel("https://1q01ntccb0ionnvuaremonger-service.cfapps.eu10.hana.ondemand.com/odata.xsodata", true);

			var jModel = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(jModel, "TableData");
	     	this.getView().setModel(oModel);
			oModel.read("/order_details", {
           
             success: function(oData){
                         
                         var model1 = this.getView().getModel("TableData");
                         model1.setData(oData);
                         var res = oData.results;
                         var count1 = 0;
                         var count2 = 0;
                         var count3 = 0;
                         for(var i=0;i<oData.results.length;i++)
                         {
                         	if (res[i].REQUESTER_LOCATION == "Mahadevpura")
                         		count1++;
                         	else if (res[i].REQUESTER_LOCATION == "Hoodi")
                         		count2++;
                         	else if (res[i].REQUESTER_LOCATION == "Whitefield")
                         		count3++;
                         }
                         
                         this.getView().setModel(model1, "TableData");
                         this.getView().byId("Hoodi").setCount(count2);
                         this.getView().byId("Mahadevpura").setCount(count1);
                         this.getView().byId("Whitefield").setCount(count3);
                         
                      }.bind(this)
            });
            
            
            
		},
		
		_showObject : function (oItem,title) {
			this.getRouter().navTo("object",{id:JSON.stringify(title)});
			
		
			
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
							if (res[i].REQUESTER_LOCATION == sKey)
							arr.push(res[i]);
						}
						return {results : arr};
					
				},		
			
			onQuickFilter: function(oEvent) {
				var oModel = new sap.ui.model.odata.ODataModel("https://1q01ntccb0ionnvuaremonger-service.cfapps.eu10.hana.ondemand.com/odata.xsodata", true);
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
			
		

		onPress : function (oEvent) {
			// The source is the list item that got pressed
			var title = oEvent.getSource().getCells()[0].getTitle();
			this._showObject(oEvent.getSource(),title);
		}
		
	});
});