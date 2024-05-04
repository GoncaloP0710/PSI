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
    test: { type: Schema.Types.ObjectId, ref: "Errortest", required: false }
});

// Export model
module.exports = mongoose.model("Webpage", webpageSchema); 