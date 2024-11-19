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
				
				 var oLocalData = {
		        zjblessons_base_Headers: [
		            {
		                HeaderId: "Header001",
		                DocumentNumber: "DocumentNumber001",
		                DocumentDate: "2024-11-19",
		                PlantText: "PlantText001",
		                RegionText: "Region1",
		                Description: "Sample Description 1",
		                Created: "2024-10-01",
		                Order: 1 
		            },
		            {
		                HeaderId: "Header002",
		                DocumentNumber: "DocumentNumber002",
		                DocumentDate: "2024-11-20",
		                PlantText: "PlantText002",
		                RegionText: "Region2",
		                Description: "Sample Description 4",
		                Created: "2024-10-02",
		                Order: 4
		            },
		            {
		                HeaderId: "Header003",
		                DocumentNumber: "DocumentNumber003",
		                DocumentDate: "2024-11-20",
		                PlantText: "PlantText003",
		                RegionText: "Region3",
		                Description: "Sample Description 3",
		                Created: "2024-10-02",
		                Order: 3
		            },
		            {
		                HeaderId: "Header004",
		                DocumentNumber: "DocumentNumber004",
		                DocumentDate: "2024-11-20",
		                PlantText: "PlantText004",
		                RegionText: "Region4",
		                Description: "Sample Description 4",
		                Created: "2024-10-02",
		                Order: 2
		            },
		            {
		                HeaderId: "Header005",
		                DocumentNumber: "DocumentNumber005",
		                DocumentDate: "2024-11-20",
		                PlantText: "PlantText005",
		                RegionText: "Region5",
		                Description: "Sample Description 5",
		                Created: "2024-10-02",
		                Order: 0
		            }
		        ]
		    };


				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				this._aTableSearchState = [];

				var oLocalModel = new JSONModel(oLocalData);
			    this.getView().setModel(oLocalModel);
			
			    oViewModel = new JSONModel({
			        worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
			        shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
			        shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
			        shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
			        tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
			        tableBusyDelay: 0
			    });
			    this.setModel(oViewModel, "worklistView");

				oTable.attachEventOnce("updateFinished", function(){
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},
			
			onDropSelectedProductsTable: function (oEvent) {
				    var oDraggedItem = oEvent.getParameter("draggedControl"); 
				    var oDroppedItem = oEvent.getParameter("droppedControl"); 
				    var sDropPosition = oEvent.getParameter("dropPosition"); 
				
				    var oModel = this.getView().getModel();
				    var aData = oModel.getProperty("/zjblessons_base_Headers");
				
				    var oDraggedData = oDraggedItem.getBindingContext().getObject();
				
				    var oDroppedData = oDroppedItem.getBindingContext().getObject();
				
				    var iDraggedOrder = oDraggedData.Order;
				    var iDroppedOrder = oDroppedData.Order;
				
				    var iNewOrder = sDropPosition === "After" ? iDroppedOrder + 1 : iDroppedOrder;
				
				    oDraggedData.Order = iNewOrder;
				
				    aData.forEach(function (item) {
				        if (item.HeaderId !== oDraggedData.HeaderId) {
				            if (item.Order >= iNewOrder && iDraggedOrder > iNewOrder) {
				                item.Order++;
				            } else if (item.Order <= iNewOrder && iDraggedOrder < iNewOrder) {
				                item.Order--;
				            }
				        }
				    });
				
				    oModel.setProperty("/zjblessons_base_Headers", aData);
				
				    this.byId("table").getBinding("items").sort(new Sorter("Order", false));
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
				oTable.getBinding("items").refresh(true);
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