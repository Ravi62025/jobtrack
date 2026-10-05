const express = require("express");

const {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication,
    getApplicationById,
} = require("../controllers/application.controllers");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Every route below this line requires a valid token
router.use(protect);

router.post("/", createApplication);

router.get("/", getApplications);

router.get("/:id", getApplicationById);

router.put("/:id", updateApplication);

router.delete("/:id", deleteApplication);

module.exports = router;