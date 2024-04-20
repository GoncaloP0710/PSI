const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const webpageSchema = new Schema({
    url: { type: String, required: true },
    avaliacao: { 
        type: String, 
        enum: ['Conforme', 'Não conforme']
      },
      dataDaUltimaAvaliacao: { type: Date },
});

// Export model
module.exports = mongoose.model("Webpage", webpageSchema); 