sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Text",
	"sap/m/Avatar"

], (Control, Text, Avatar) => {
	"use strict";

	return Control.extend("zjblessons.bindingsApp.controller.control.AvatarAndLabel", {
		metadata: {
			properties: {},
			aggregations: {
				_avatar: { type: "sap.m.Avatar", multiple: false, visibility: "hidden" },
				_text: { type: "sap.m.Text", multiple: false, visibility: "hidden" }
			},
			events: {}
		},

		init() {

			this.setAggregation("_avatar", new Avatar({
				displayShape: "Circle",
				displaySize: "S",
				src: "sap-icon://person-placeholder",
				showBorder: true,
				visible: true,
				badgeIcon: "sap-icon://accept",
				badgeValueState: "Success"
			}));
			this.setAggregation("_text", new Text({
				text: "{i18n>customControlText}",
				maxLines: 5,
				textAlign: "Begin",
				textDirection: "Inherit",
				wrapping: true
			}).addStyleClass("sapUiSmallMargin"));
		},

		reset() {

		},

		renderer(oRm, oControl) {
			oRm.openStart("div", oControl);
			oRm.style("display", "flex");
			oRm.style("align-items", "center");
			oRm.openEnd();
			
			oRm.renderControl(oControl.getAggregation("_avatar"));
			oRm.renderControl(oControl.getAggregation("_text"));
			oRm.close("div");
		}
	});
});
