const asyncHandler = require("express-async-handler");
const Webpages = require('../models/webpage');

exports.webpages_list_get = asyncHandler(async (req, res, next) => {
    try {
        const webpages = await Webpages.find().exec();
        res.json(webpages);
    } catch {
        res.json([]);
    }
});