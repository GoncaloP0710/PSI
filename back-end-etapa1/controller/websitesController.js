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