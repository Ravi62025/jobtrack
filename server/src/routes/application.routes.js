const express = require("express");

const {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication,
    getApplicationById,
    getApplicationStats,
} = require("../controllers/application.controllers");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Every route below this line requires a valid token
router.use(protect);

router.post("/", createApplication);

router.get("/", getApplications);

router.get("/stats", getApplicationStats); 

router.get("/:id", getApplicationById);

router.put("/:id", updateApplication);

router.delete("/:id", deleteApplication);

module.exports = router;