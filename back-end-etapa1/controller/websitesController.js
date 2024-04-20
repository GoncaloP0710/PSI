const asyncHandler = require("express-async-handler");
const Website = require('../models/website');

exports.websites_list_get = asyncHandler(async (req, res, next) => {
    try {
        const websites = await Website.find().exec();
        res.json(websites);
    } catch {
        res.json([]);
    }
});

exports.websites_by_avaliacao_get = asyncHandler(async (req, res, next) => {
    try {
        const avaliacao = req.query.avaliacao;

        const websites = await Website.find({ avaliacao: avaliacao }).exec();
        res.json(websites);

    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});