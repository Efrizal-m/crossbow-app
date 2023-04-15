var mongoose = require("./appmodel");

module.exports = mongoose.model(
	"RelatedHoldingMetrics",
	new mongoose.Schema(
    {
        project: { type: String, required: true },
        type: { type: String, required: true },
        data: { type: Array, required: true },
        expires: { type: Date }
    },
    { timestamps: true }
    ),
	"related_holding_metrics"
);
