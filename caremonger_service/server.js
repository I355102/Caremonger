/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0*/
/*eslint-env node, es6 */
"use strict";
// process.env['DBCAPI_API_DLL']="node_modules/@sap/hana-client/prebuilt/darwinintel64-xcode7/libdbcapiHDB.dylib";
const port = process.env.PORT || 3000;
const server = require("http").createServer();

//Initialize Express App for XSA UAA and HDBEXT Middleware
const xsenv = require("@sap/xsenv");
const xsHDBConn = require("@sap/hdbext");
const express = require("express");
const helmet = require('helmet');
var app = express();

var options = {
	auditLog : { logToConsole: true }, // change to auditlog service for productive scenarios
	redirectUrl: "/lib/index.js"
};

var hanaService = xsenv.getServices({ hana: {tag: "hana"} });

// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({ hana: {tag: "hana"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

app.use(
	xsHDBConn.middleware(hanaService.hana),
	helmet.xssFilter()
);
app.disable("x-powered-by");

//Setup Additonal Node.js Routes
require("./router")(app, server);

//Start the Server 
server.on("request", app);
server.listen(port, function () {
	console.info(`HTTP Server: ${server.address().port}`);
});
