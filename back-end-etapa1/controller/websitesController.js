const asyncHandler = require("express-async-handler");
const Website = require('../models/website');

exports.websites_list_get = asyncHandler(async (req, res, next) => {
    try {
        const websites = await Website.find().populate('webpages').exec();
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

exports.websites_list_get_ordered = asyncHandler(async (req, res, next) => {
    try {
        const sortField = req.query.sortField || 'dataDeRegisto';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        const websites = await Website.find().sort({ [sortField]: sortOrder }).exec();
        res.json(websites);
    } catch {
        res.json([]);
    }
});