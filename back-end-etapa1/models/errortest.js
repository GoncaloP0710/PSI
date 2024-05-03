const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const errortestSchema = new Schema({
    tipo: { type: String, required: true }, // "act-rules" ou "wcag-techniques"
    codigo : { type: String, required: true },
    name: { type: String, required: true },
    outcome: { type: String, required: true },
    A: { type: Number, default: 0 },
    AA: { type: Number, default: 0 },
    AAA: { type: Number, default: 0 },
    results: [{
        htmlCode: String,
        pointer: String
    }]
});

module.exports = mongoose.model('Errortest', errortestSchema);