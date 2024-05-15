const express = require("express");
const router = express.Router();
const webpage_controller = require("../controller/webpageController");

router.get("/:id", webpage_controller.get_webpage);
router.post('/', webpage_controller.create_webpage);
router.delete('/', webpage_controller.delete_webpages);

router.post('/:webpageId/filter', webpage_controller.filter_webpage_tests);

module.exports = router;