"use strict";

module.exports = (app, server) => {
	app.use("/extract", require("./routes/text_extractor")());	
	app.use("/order", require("./routes/order")());
	app.use("/processor", require("./routes/processor")());
};