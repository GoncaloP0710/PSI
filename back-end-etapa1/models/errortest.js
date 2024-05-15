const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const errortestSchema = new Schema({

    actrules: [{
        moduleName: { type: String, required: true },
        errorCode: { type: String, required: true },
        outcome: { type: String, required: true },
        A: { type: Number, default: 0 },
        AA: { type: Number, default: 0 },
        AAA: { type: Number, default: 0 },
        resultsTupleList: [{
            htmlCode: { type: String, required: true },
            pointer: { type: String, required: true },
        }],
    }],

    wcagtechniques: [{
        moduleName: { type: String, required: true },
        errorCode: { type: String, required: true },
        outcome: { type: String, required: true },
        A: { type: Number, default: 0 },
        AA: { type: Number, default: 0 },
        AAA: { type: Number, default: 0 },
        resultsTupleList: [{
            htmlCode: { type: String, required: true },
            pointer: { type: String, required: true },
        }],
    }],

    url: { type: String, required: true },


});

module.exports = mongoose.model('Errortest', errortestSchema);