const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const websiteSchema = new Schema({
  url: { type: String, required: true },
  avaliacao: { 
    type: String, 
    enum: ['Por avaliar', 'Em avaliação', 'Avaliado', 'Erro na avaliação'], 
    required: true 
  },
  dataDeRegisto: { type: Date, default: Date.now },
  dataDaUltimaAvaliacao: { type: Date },
  webpages: [{ type: Schema.Types.ObjectId, ref: "Webpage", required: false }],
});

// Export model
module.exports = mongoose.model("Website", websiteSchema); 