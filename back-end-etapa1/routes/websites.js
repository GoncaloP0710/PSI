const express = require('express');
const router = express.Router();
const websitesController = require('../controller/websitesController');

router.get('/', websitesController.websites_list_get);
router.get('/byAvaliacao', websitesController.websites_by_avaliacao_get);

router.get('/ordered', websitesController.websites_list_get_ordered);

module.exports = router;