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
  countA: { type: Number, default: 0 },
  countAA: { type: Number, default: 0 },
  countAAA: { type: Number, default: 0 },
  topTenErrors: [{ type: String }],
  percentageCountA: { type: Number, default: 0 },
  percentageCountAA: { type: Number, default: 0 },
  percentageCountAAA: { type: Number, default: 0 },
  countAny: { type: Number, default: 0 },
  countNone: { type: Number, default: 0 },
  percentageNone: { type: Number, default: 0 },
  percentageAny: {type: Number, default: 0}
});

// Export model
module.exports = mongoose.model("Website", websiteSchema); 