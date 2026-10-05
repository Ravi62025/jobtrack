const Application = require("../models/application.model");

const createApplication = async (req, res) => {
    try {
        // user comes AFTER the spread, so a "user" in req.body is overwritten
        const application = await Application.create({
            ...req.body,
            user: req.user._id
        });

        res.status(201).json({
            message: "Application created successfully",
            application
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create application",
            error: error.message
        });
    }
};

const getApplications = async (req, res) => {
    try {
        const {
            status,
            company,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        // Every list query starts with the owner
        const filter = { user: req.user._id };

        if (status) {
            filter.status = status;
        }

        if (company) {
            filter.company = {
                $regex: company,
                $options: "i"
            };
        }

        let query = Application.find(filter);

        if (sort === "newest") {
            query = query.sort({ createdAt: -1 });
        }

        if (sort === "oldest") {
            query = query.sort({ createdAt: 1 });
        }

        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(Number(limit));

        const applications = await query;

        res.status(200).json({
            page: Number(page),
            limit: Number(limit),
            applications
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch applications",
            error: error.message
        });
    }
};

const updateApplication = async (req, res) => {
    try {
        // Remove any "user" the client sent so ownership can't be reassigned
        const { user, ...updates } = req.body;

        const application = await Application.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application updated successfully",
            application
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(500).json({
            message: "Failed to update application",
            error: error.message
        });
    }
};

const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application deleted successfully"
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(500).json({
            message: "Failed to delete application",
            error: error.message
        });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            application
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(500).json({
            message: "Failed to fetch application",
            error: error.message
        });
    }
};

module.exports = {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication,
    getApplicationById,
};