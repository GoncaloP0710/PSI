const asyncHandler = require("express-async-handler");
const Website = require("../models/website");
const Webpage = require('../models/webpage');
const { body, validationResult } = require("express-validator");
const URL = require('url').URL;

const { QualWeb, generateEARLReport } = require('@qualweb/core');
const fs = require('fs').promises;
const fsp = require('fs');

const path = require('path');

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

            // Check if the URL is valid
            try {
                new URL(req.body.url);
            } catch (error) {
                res.status(400).send('Invalid URL');
                return;
            }

            // Check if a website with the same URL already exists
            const existingWebsite = await Website.findOne({ url: req.body.url }).exec();
            if (existingWebsite) {
                res.status(400).send('A website with this URL already exists');
                return;
            }

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

        // Parse the URLs
        const websiteUrl = new URL(website.url);
        const webpageUrl = new URL(webpage.url);

        // Check if the webpage URL belongs to the website URL
        if (websiteUrl.hostname !== webpageUrl.hostname) {
            res.status(400).send('The webpage URL does not belong to the website URL');
            return;
        }

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

exports.evaluateAndSaveReports = asyncHandler(async (req, res, next) => {
    const webpageIds = req.body.webpageIds; // assuming the webpage IDs are sent in the request body
    const qualweb = new QualWeb();
  
    // Create the ./reports directory if it doesn't exist
    await fs.mkdir('./reports', { recursive: true });
  
    var errorCounts = {};
  
    for (const webpageId of webpageIds) {
      const webpage = await Webpage.findById(webpageId).exec();
  
      if (webpage) {

        await qualweb.start();

        const evaluation = await qualweb.evaluate({ url: webpage.url });

        await qualweb.stop();
  
        const report = JSON.stringify(evaluation, null, 2);
        const reportPath = `./reports/${webpageId}.json`;
        await fs.writeFile(reportPath, report);
  
        errorCounts = countLevels(reportPath);
      }
    }

    res.status(200).json({
    success: true,
    data: errorCounts
    });
});

function countLevels(filename) {
    const filePath = path.resolve(filename);
    console.log(`Reading file: ${filePath}`);
    try {
        const data = fsp.readFileSync(filePath, 'utf8');
        const json = JSON.parse(data);

        var A = 0;
        var AA = 0;
        var AAA = 0;

        var errorList = [];

        var errorDictionary = {};

        // Get the URL key from the JSON data
        const urlKey = Object.keys(json)[0];
        console.log(`URL key: ${urlKey}`);

        const modules = json[urlKey].modules;

        if (!modules) {
            console.error('Invalid JSON data: "modules" does not exist');
            return null;
        }

        for (const [moduleName, moduleValue] of Object.entries(modules)) {

            if (moduleName!== "act-rules" && moduleName !== "wcag-techniques") {
                console.log(`Skiping module: ${moduleName}`);
                continue;
            }
            console.log(`Processing module: ${moduleName}`);

            for (const [assertionKey, assertionValue] of Object.entries(moduleValue.assertions)) {

                console.log(`Processing assertion: ${assertionKey}`);

                const errorName = assertionValue.name;
                console.log(`Error name: ${errorName}`);

                const metadata = assertionValue.metadata;
                const outcome = metadata.outcome;

                if (outcome !== 'failed') {
                    console.log('Outcome is not failed. Skipping...');
                    continue;
                }
                errorList.push(errorName);

                const successCriteria = metadata['success-criteria'];
                for (const [criteriaKey, criteriaValue] of Object.entries(successCriteria)) {

                    console.log(`Processing success criteria: ${criteriaValue.name}`);

                    const level = criteriaValue.level;
                    console.log(`Processing success criteria with level: ${level}`);

                    if (!errorDictionary[errorName]) {
                        errorDictionary[errorName] = { A: 0, AA: 0, AAA: 0 };
                    }
                    errorDictionary[errorName][level]++;

                    if (level === 'A') {
                        A++;
                    } else if (level === 'AA') {
                        AA++;
                    } else if (level === 'AAA') {   
                        AAA++;
                    }
                }
            }
        }

        console.log('Finished processing JSON data.');
        console.log(`Error list: ${errorList}`);
        console.log(`A: ${A}, AA: ${AA}, AAA: ${AAA}`);
        return errorDictionary;

    } catch (err) {
        console.error('An error occurred while trying to read the file:', err);
        return null;
    }
}