const asyncHandler = require("express-async-handler");
const Webpages = require('../models/webpage');
const ErrorPage = require('../models/errortest');

exports.get_errortest = asyncHandler(async (req, res, next) => {
    try {
        const errortest = await ErrorPage.find().exec();
        res.json(errortest);
    } catch {
        res.json([]);
    }
});