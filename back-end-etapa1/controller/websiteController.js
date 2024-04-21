const asyncHandler = require("express-async-handler");
const Website = require("../models/website");
const Webpage = require('../models/webpage');
const { body, validationResult } = require("express-validator");

exports.get_website = asyncHandler(async (req, res, next) => {
    try {
        const website = await Website.findById(req.params.id).populate('webpages').exec();
        res.json(website);
    } catch {
        res.json({});
    }
});

exports.create_website = [

    body("url").trim(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const websiteDetails = { 
                url: req.body.url, 
                avaliacao: 'Por avaliar', 
                dataDeRegisto: new Date() 
            };
            const website = new Website(websiteDetails);
            await website.save();
            res.json(website);
        } else {
            res.sendStatus(404);
        }
})];

exports.delete_website = asyncHandler(async (req, res, next) => {
    try {
        await Website.findByIdAndDelete(req.params.id);
        return;
    } catch {
        res.sendStatus(404);
    }
});

exports.add_webpage = asyncHandler(async (req, res, next) => {
    try {
        // Find the website by ID from the URL parameters
        const website = await Website.findById(req.params.id).exec();

        // Find the webpage by ID from the request body
        const webpage = await Webpage.findById(req.body.webpageId).exec();

        console.log(website);
        console.log(webpage);

        // Check if the webpage already exists in the website's webpages array
        if (!website.webpages.includes(webpage._id)) {
            // Add the webpage to the website's webpages array
            website.webpages.push(webpage);
            await website.save();
        }

        // Populate the webpages field and save the document
        const populatedWebsite = await Website.findById(req.params.id).populate('webpages').exec();
        res.json(populatedWebsite);

    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

exports.update_avaliacao = asyncHandler(async (req, res, next) => {
    try {
        const websiteId = req.params.id;
        const newAvaliacao = req.body.avaliacao;

        const website = await Website.findByIdAndUpdate(
            websiteId, 
            { 
                avaliacao: newAvaliacao, 
                dataDaUltimaAvaliacao: Date.now() 
            }, 
            { new: true }
        ).exec();

        res.json(website);
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

