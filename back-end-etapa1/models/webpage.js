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
    testList: [{
      moduleName: { type: String, required: true },
      errorCode: { type: String, required: true },
      // errorName: { type: String, required: true },
      outcome: { type: String, required: true },
      A: { type: Number, default: 0 },
      AA: { type: Number, default: 0 },
      AAA: { type: Number, default: 0 },
      // resultsTupleList: { type: Array }
    }]
});

// Export model
module.exports = mongoose.model("Webpage", webpageSchema); 