const asyncHandler = require("express-async-handler");
const Website = require("../models/website");
const Webpage = require('../models/webpage');
const { body, validationResult } = require("express-validator");
const URL = require('url').URL;

const { QualWeb, generateEARLReport } = require('@qualweb/core');
const fs = require('fs').promises;
const fsp = require('fs');

const path = require('path');
const Errortest = require('../models/errortest');

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
  
    for (const webpageId of webpageIds) {
      const webpage = await Webpage.findById(webpageId).exec();
  
      if (webpage) {

        await qualweb.start();
        const evaluation = await qualweb.evaluate({ url: webpage.url });
        await qualweb.stop();
  
        const report = JSON.stringify(evaluation, null, 2);
        const reportPath = `./reports/${webpageId}.json`;
        await fs.writeFile(reportPath, report);
  
        const errorCounts = await countLevels(reportPath);
        var A = errorCounts.A;
        var AA = errorCounts.AA;
        var AAA = errorCounts.AAA;
        var actrules = errorCounts.actrules;
        var wcagtechniques = errorCounts.wcagtechniques;

        var test = await createErrortest(actrules, wcagtechniques);
        // console.log(`Test: ${test}`);

        // // Update the webpage document
        // await Webpage.updateOne({ _id: webpageId }, {
        //     dataDaUltimaAvaliacao: new Date(),
        //     A: A,
        //     AA: AA,
        //     AAA: AAA,
        //     test: test
        // });
      }
    }

    res.json(test);
});

async function countLevels(filename) {
    const filePath = path.resolve(filename);
    console.log(`Reading file: ${filePath}`);
    try {
        const data = fsp.readFileSync(filePath, 'utf8');
        const json = JSON.parse(data);

        // All failed errors combined
        var ATOTAL = 0;
        var AATOTAL = 0;
        var AAATOTAL = 0;

        let actrules = [];
        let wcagtechniques = [];

        const urlKey = Object.keys(json)[0];
        const modules = json[urlKey].modules;

        if (modules === undefined || modules === null) {
            console.error('Invalid JSON data: "modules" does not exist');
            return null;
        }

        for (const [moduleName, moduleValue] of Object.entries(modules)) {

            if (moduleName!== "act-rules" && moduleName !== "wcag-techniques") {
                continue;
            }

            for (const [assertionKey, assertionValue] of Object.entries(moduleValue.assertions)) {

                const errorCode = assertionValue.code;
                // const results = assertionValue.results;
                // var resultsTupleList = [];

                // for (const [resultKey, resultValue] of Object.entries(results)) {

                //     const code = resultValue.resultCode;

                //     const elements = resultValue.elements;
                //     for (const [elementKey, elementValue] of Object.entries(elements)) {
                //         const htmlCode = elementValue.htmlCode;
                //         const pointer = elementValue.pointer;

                //         resultsTupleList.push({ htmlCode: htmlCode, pointer: pointer });
                //     }
                // }

                const metadata = assertionValue.metadata;
                const outcome = metadata.outcome;

                var A = 0;
                var AA = 0;
                var AAA = 0;

                const successCriteria = metadata['success-criteria'];

                for (const [criteriaKey, criteriaValue] of Object.entries(successCriteria)) {
                    const level = criteriaValue.level;

                    if (outcome == 'failed') {
                        if (level === 'A') {
                            ATOTAL++;
                        } else if (level === 'AA') {
                            AATOTAL++;
                        } else if (level === 'AAA') {   
                            AAATOTAL++;
                        }
                    }
                    if (level === 'A') {
                        A++;
                    } else if (level === 'AA') {
                        AA++;
                    } else if (level === 'AAA') {   
                        AAA++;
                    }
                }

                let item = {
                    moduleName: moduleName,
                    errorCode: errorCode,
                    outcome: outcome,
                    A: A,
                    AA: AA,
                    AAA: AAA,
                };
                
                if (moduleName === 'act-rules') {
                    actrules.push(item);
                } else if (moduleName === 'wcag-techniques') {
                    wcagtechniques.push(item);
                }
            }
        }

        return {
            A: ATOTAL,
            AA: AATOTAL,
            AAA: AAATOTAL,
            actrules: actrules,
            wcagtechniques: wcagtechniques
        };

    } catch (err) {
        console.error('An error occurred while trying to read the file:', err);
        return null;
    }
}

async function createErrortest(actrules, wcagtechniques) {
    const errortestDetails= {
        actrules: actrules,
        wcagtechniques: wcagtechniques,
    };
    const errortest = new Errortest(errortestDetails);
    await errortest.save();
    return errortest;
}