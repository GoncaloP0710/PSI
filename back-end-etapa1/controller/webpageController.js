const asyncHandler = require("express-async-handler");
const Webpage = require("../models/webpage");
const Website = require('../models/website'); // Add this line
const ErrorPage = require('../models/errortest');

const { body, validationResult } = require("express-validator");

exports.get_webpage = asyncHandler(async (req, res, next) => {
    try {
        const webpage = await Webpage.findById(req.params.id).populate('test').exec();
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
            // Check if the URL is valid
            try {
                new URL(req.body.url);
            } catch (error) {
                res.status(400).send('Invalid URL');
                return;
            }
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

exports.delete_webpages = asyncHandler(async (req, res, next) => {
    try {
        const webpageIds = req.body.webpageIds; // assuming the webpage IDs are sent in the request body

        for (const webpageId of webpageIds) {

            // Find the webpage
            const webpage = await Webpage.findById(webpageId);

            // Find all websites that contain the webpage
            const websites = await Website.find({ webpages: webpageId }).exec();

            // Delete all error pages with the same URL
            await ErrorPage.deleteMany({ url: webpage.url });

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
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

exports.filter_webpage_tests = asyncHandler(async (req, res, next) => {
    try {
        console.log(req.body);
        const { actrules, wcagtechniques, resultFilter, AFilter, AAFilter, AAAFilter } = req.body;
        
        const webpage = await Webpage.findById(req.params.webpageId).populate('test').exec();
        
        // Fetch tests for the webpage
        const tests = webpage.test;

        const filteredTest = filterTest(tests, actrules, wcagtechniques, resultFilter, AFilter, AAFilter, AAAFilter);
        res.status(200).json(filteredTest);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
});

function filterTest(test, actrules, wcagtechniques, resultFilter, AFilter, AAFilter, AAAFilter) {
    // Filter actrules
    const filteredActRules = actrules ? test.actrules.filter(rule => rule.outcome === resultFilter && (AFilter ? rule.A > 0 : true) && (AAFilter ? rule.AA > 0 : true) && (AAAFilter ? rule.AAA > 0 : true)) : [];

    // Filter wcagtechniques
    const filteredWcagTechniques = wcagtechniques ? test.wcagtechniques.filter(technique => technique.outcome === resultFilter && (AFilter ? technique.A > 0 : true) && (AAFilter ? technique.AA > 0 : true) && (AAAFilter ? technique.AAA > 0 : true)) : [];

    // Return filtered actrules and wcagtechniques
    return {
        actrules: filteredActRules,
        wcagtechniques: filteredWcagTechniques
    };
}