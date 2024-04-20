const express = require("express");
const router = express.Router();
const webpage_controller = require("../controller/webpageController");

router.get("/:id", webpage_controller.get_webpage);
router.post('/', webpage_controller.create_webpage);
router.delete('/:id', webpage_controller.delete_webpage);

module.exports = router;