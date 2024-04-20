const asyncHandler = require("express-async-handler");
const Webpage = require("../models/webpage");
const { body, validationResult } = require("express-validator");

exports.get_webpage = asyncHandler(async (req, res, next) => {
    try {
        const webpage = await Webpage.findById(req.params.id).exec();
        res.json(webpage);
    } catch {
        res.json({});
    }
});

exports.create_webpage = [

    body("url").trim(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const webpage = new Webpage({
                url: req.body.url,
            });
            await webpage.save();
            res.json(webpage);
        } else {
            res.sendStatus(404);
        }
})];

exports.delete_webpage = asyncHandler(async (req, res, next) => {
    try {
        await Webpage.findByIdAndDelete(req.params.id);
        return;
    } catch {
        res.sendStatus(404);
    }
});