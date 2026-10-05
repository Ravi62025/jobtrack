const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"],
            default: "Wishlist"
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship"],
            default: "Full-time"
        },

        location: {
            type: String,
            trim: true
        },

        jobUrl: {
            type: String,
            trim: true
        },

        appliedDate: {
            type: Date
        },

        deadline: {
            type: Date
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Application", applicationSchema);