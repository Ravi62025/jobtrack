// Turns user text into a literal regex pattern by escaping special characters
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
    }
    catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message,
                errors: Object.values(error.errors).map((e) => e.message)
            });
        }

        res.status(500).json({
            message: "Failed to create application",
            error: error.message
        })
    };
}

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
                $regex: escapeRegex(company),
                $options: "i"
            };
        }
        let query = Application.find(filter);

        // Always sort, and always end with _id so the order is fully deterministic
        if (sort === "oldest") {
            query = query.sort({ createdAt: 1, _id: 1 });
        } else {
            // "newest", a missing sort, or an empty sort all land here
            query = query.sort({ createdAt: -1, _id: -1 });
        }

        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(Number(limit));

        // Run both queries at the same time, using the SAME filter
        const [applications, total] = await Promise.all([
            query,
            Application.countDocuments(filter)
        ]);

        res.status(200).json({
            page: Number(page),
            limit: Number(limit),
            total,
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

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message,
                errors: Object.values(error.errors).map((e) => e.message)
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

const getApplicationStats = async (req, res) => {
    try {
        const result = await Application.aggregate([
            // 1. Keep only this user's applications
            { $match: { user: req.user._id } },

            // 2. Collapse everything that remains into ONE summary document
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    wishlist: {
                        $sum: { $cond: [{ $eq: ["$status", "Wishlist"] }, 1, 0] }
                    },
                    applied: {
                        $sum: { $cond: [{ $eq: ["$status", "Applied"] }, 1, 0] }
                    },
                    interviewing: {
                        $sum: { $cond: [{ $eq: ["$status", "Interviewing"] }, 1, 0] }
                    },
                    offer: {
                        $sum: { $cond: [{ $eq: ["$status", "Offer"] }, 1, 0] }
                    },
                    rejected: {
                        $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] }
                    }
                }
            },

            // 3. Remove the meaningless _id: null from the output
            { $project: { _id: 0 } }
        ]);

        // A user with no applications gets [] back, not a document of zeros
        const stats = result[0] || {
            total: 0,
            wishlist: 0,
            applied: 0,
            interviewing: 0,
            offer: 0,
            rejected: 0
        };

        res.status(200).json({ stats });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch statistics",
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
    getApplicationStats,
};