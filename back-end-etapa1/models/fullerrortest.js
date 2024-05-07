const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvaluationSchema = new Schema({
  url: { type: String, required: false },
  evaluationDate: { type: Date, default: Date.now },
  results: { type: Object, required: true },
});

const Evaluation = mongoose.model('Evaluation', EvaluationSchema);