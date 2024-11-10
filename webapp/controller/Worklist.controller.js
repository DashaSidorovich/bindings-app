/*global location history */
sap.ui.define([
		"zjblessons/bindingsApp/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/bindingsApp/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Sorter"
	], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Sorter) {
		"use strict";

		return BaseController.extend("zjblessons.bindingsApp.controller.Worklist", {

			formatter: formatter,


			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");


				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				this._aTableSearchState = [];

				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});
				this.setModel(oViewModel, "worklistView");

				oTable.attachEventOnce("updateFinished", function(){
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},
			onBeforeRendering: function (oEvent){
				this._bindTable();
			},
			
			_bindTable: function () {
				var oTable = this.getView().byId('table');
				
				oTable.bindItems({
					path: '/zjblessons_base_Headers',
					template: this._getTableTemplate(),

					urlParameters: {
						$select: 'HeaderId, DocumentNumber, DocumentDate, PlantText, RegionText, Description, Created'
					},
					events: {
            			dataRequested: function () {
            			}.bind(this) 
        		}
				});
			},

			
			_getTableTemplate: function(){
				var oTemplate = new sap.m.ColumnListItem({
					highlight: "{= ${DocumentNumber} !== null ? 'Success' : 'Error'}",
					type: 'Navigation',
					cells: [
						
						new sap.m.Text({
							text: '{DocumentNumber}'
						}),
						new sap.m.Text({
							text: '{DocumentDate}'
						}),
						new sap.m.Text({
							text: '{PlantText}'
						}),
						new sap.m.Text({
							text: '{RegionText}'
						}),
						new sap.m.Text({
							text: '{Description}'
						}),
						new sap.m.Text({
							text: '{Created}'
						})
						]
				});
				return oTemplate;
			},
			
			onPressGroup(oEvent){
				this.getView().byId("table").getBinding("items").sort([new Sorter('RegionText', true, true)]);
			},


			onUpdateFinished : function (oEvent) {
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");

				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},

			onPress : function (oEvent) {
				this._showObject(oEvent.getSource());
			},


			onNavBack : function() {
				history.go(-1);
			},


			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
		
					this.onRefresh();
				} else {
					var aTableSearchState = [];
					var sQuery = oEvent.getParameter("query");

					if (sQuery && sQuery.length > 0) {
						aTableSearchState = [new Filter("DocumentNumber", FilterOperator.Contains, sQuery)];
					}
					this._applySearch(aTableSearchState);
				}

			},


			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},


			_showObject : function (oItem) {
				this.getRouter().navTo("object", {
					objectId: oItem.getBindingContext().getProperty("HeaderID")
				});
			},


			_applySearch: function(aTableSearchState) {
				var oTable = this.byId("table"),
					oViewModel = this.getModel("worklistView");
				oTable.getBinding("items").filter(aTableSearchState, "Application");
				if (aTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			}

		});
	}
);