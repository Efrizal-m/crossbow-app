var mongoose = require("./appmodel");

module.exports = mongoose.model(
	"TokenLists",
	new mongoose.Schema(
    {
        token_mint: { type: String, required: true },
        token_name: { type: String },
        token_symbol: { type: String },
        token_icon: { type: String }        
    },
    { timestamps: true }
    ),
	"token_lists"
);
