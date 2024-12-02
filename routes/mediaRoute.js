const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");

// Route to get all media items
router.get("/media", mediaController.getAllMedia);
router.post("media", mediaController.createMedia);
// Route to delete a media item by ID
router.delete("/media/:id", mediaController.deleteMedia);

router.get("/media/:id", mediaController.getMediaById);

module.exports = router;
