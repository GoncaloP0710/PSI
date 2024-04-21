const asyncHandler = require("express-async-handler");
const Webpage = require("../models/webpage");
const Website = require('../models/website'); // Add this line

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
            // Check if a webpage with the same URL already exists
            const existingWebpage = await Webpage.findOne({ url: req.body.url }).exec();
            if (existingWebpage) {
                res.status(400).send('A webpage with this URL already exists');
                return;
            }

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
        const webpageId = req.params.id;

        // Find all websites that contain the webpage
        const websites = await Website.find({ webpages: webpageId }).exec();

        // Update each website to remove the webpage
        for (const website of websites) {
            const index = website.webpages.indexOf(webpageId);
            if (index > -1) {
                website.webpages.splice(index, 1);
                await website.save();
            }
        }

        // Delete the webpage
        await Webpage.findByIdAndDelete(webpageId);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});