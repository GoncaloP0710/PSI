const express = require("express");
const router = express.Router();
const website_controller = require("../controller/websiteController");

router.get("/:id", website_controller.get_website);
router.post('/', website_controller.create_website);
router.delete('/:id', website_controller.delete_website);

module.exports = router;