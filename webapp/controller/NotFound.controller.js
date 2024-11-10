sap.ui.define([
		"zjblessons/bindingsApp/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zjblessons.bindingsApp.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);