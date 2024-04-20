const express = require('express');
const router = express.Router();
const webpagesController = require('../controller/webpagesController');

router.get('/', webpagesController.webpages_list_get);

module.exports = router;