var mongoose = require("./appmodel");

module.exports = mongoose.model(
	"Whales",
	new mongoose.Schema(
    {
        project: { type: String, required: true },
        url_data: { type: String, required: true }
    },
    { timestamps: true }
    ),
	"whales"
);

