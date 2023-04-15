const mongoose = require("./appmodel.js");

module.exports = mongoose.model(
	"Dapp",
	new mongoose.Schema(
		{
			dapp: { type: String, required: true },
            logo: { type: String }
		},
		{ timestamps: true }
	),
	"dapps"
);
