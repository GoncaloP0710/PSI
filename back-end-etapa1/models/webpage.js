const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const webpageSchema = new Schema({
    url: { type: String, required: true },
    avaliacao: { 
        type: String, 
        enum: ['Conforme', 'Não conforme']
    },
    dataDaUltimaAvaliacao: { type: Date },
    A: { type: Number, default: 0 },
    AA: { type: Number, default: 0 },
    AAA: { type: Number, default: 0 },
    test: { type: Schema.Types.ObjectId, ref: "Errortest", required: false },
    passed: { type: Number, default: 0 },
    inapplicable: { type: Number, default: 0 },
    warning: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    percentagePassed: { type: Number, default: 0 },
    percentageInapplicable: { type: Number, default: 0 },
    percentageWarning: { type: Number, default: 0 },
    percentageFailed: { type: Number, default: 0 },
});

// Export model
module.exports = mongoose.model("Webpage", webpageSchema);