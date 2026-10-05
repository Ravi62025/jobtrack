const express = require("express");
const cors = require("cors");
const applicationRoutes = require("./routes/application.routes");
const authRoutes=require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        message: "JobTrack API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

module.exports = app;