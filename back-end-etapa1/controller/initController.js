const asyncHandler = require("express-async-handler");
const Website = require('../models/website');
const mongoose = require("mongoose");

exports.init = asyncHandler(async (req, res, next) => {
    await populateDb();
    res.send('DATABASE POPULATED');
});

async function populateDb() {
    await deleteDb();
    await createWebsites();
}

async function deleteDb() {
    mongoose.connection.collections['websites'].drop();
}

async function createWebsites() {
    await Promise.all([
        websiteCreate('https://example1.com'),
        websiteCreate('https://example2.com'),
        websiteCreate('https://example3.com'),
        websiteCreate('https://example4.com'),
        websiteCreate('https://example5.com'),
        websiteCreate('https://example6.com'),
    ]);
}

async function websiteCreate(url) {
    const website = new Website({
        url: url, 
        avaliacao: 'Por avaliar', 
        dataDeRegisto: new Date()
    });
    await website.save();
}

