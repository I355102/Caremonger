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

	
		onInit: function (oEvent) {
			this.sid = null;
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			var oModel = new sap.ui.model.odata.ODataModel("https://stmkib0ixdfgljxharemonger-extract.cfapps.eu10.hana.ondemand.com/odata.xsodata", true);
			debugger;
	     	this.getView().setModel(oModel);
	     	
		},
		
		_onObjectMatched : function (oEvent) {
			this.sid = oEvent;
		
			var oModel = new sap.ui.model.odata.ODataModel("https://lvhmfpf6jpgn677waremonger-service.cfapps.eu10.hana.ondemand.com/odata.xsodata", true);
			var jModel = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(jModel, "TableData");
	     	this.getView().setModel(oModel);
			oModel.read("/processor_texts", {
           
             success: function(oData){
                         
                         var model1 = this.getView().getModel("TableData");
                         model1.setData(oData);
                         this.getView().setModel(model1, "TableData");
                      }.bind(this)
            });
		
			
		},
	
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("main", {}, true);
			}
		},

	
		_bindView : function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.ProductID,
				sObjectName = oObject.ProductName;

			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/shareSendEmailSubject",
			oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
			oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

			// Update the comments in the list
			var oList = this.byId("idCommentsList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(new Filter("productID", FilterOperator.EQ, sObjectId));
		},

		/**
		 * Updates the model with the user comments on Products.
		 * @function
		 * @param {sap.ui.base.Event} oEvent object of the user input
		 */
		onClick1 : function(oEvent)
		{
			statusModel = this.getModel("TableData");
			var status = statusModel.getData().status;
			
			
		},
		
		onPost: function (oEvent) {
			var oFormat = DateFormat.getDateTimeInstance({style: "medium"});
			var sDate = oFormat.format(new Date());
			var oObject = this.getView().getBindingContext().getObject();
			var sValue = oEvent.getParameter("value");
			var oEntry = {
				productID: oObject.ProductID,
				type: "Comment",
				date: sDate,
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
























