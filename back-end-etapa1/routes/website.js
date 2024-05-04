const express = require("express");
const router = express.Router();
const website_controller = require("../controller/websiteController");

router.get("/:id", website_controller.get_website);
router.post('/', website_controller.create_website);
router.delete('/:id', website_controller.delete_website);
router.post('/:id/webpages', website_controller.add_webpage);
router.put('/:id/updateAvaliacao', website_controller.update_avaliacao);

router.post('/:id/evaluate', website_controller.evaluateAndSaveReports);

module.exports = router;