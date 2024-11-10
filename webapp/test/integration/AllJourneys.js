/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zjblessons/bindingsApp/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zjblessons/bindingsApp/test/integration/pages/Worklist",
	"zjblessons/bindingsApp/test/integration/pages/Object",
	"zjblessons/bindingsApp/test/integration/pages/NotFound",
	"zjblessons/bindingsApp/test/integration/pages/Browser",
	"zjblessons/bindingsApp/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zjblessons.bindingsApp.view."
	});

	sap.ui.require([
		"zjblessons/bindingsApp/test/integration/WorklistJourney",
		"zjblessons/bindingsApp/test/integration/ObjectJourney",
		"zjblessons/bindingsApp/test/integration/NavigationJourney",
		"zjblessons/bindingsApp/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});