require("dotenv").config();

const app = require("./src/app");
const connectDB=require('./src/DB/db');
const User = require("./src/models/user.model");

const PORT = process.env.PORT || 5000;

connectDB();




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});