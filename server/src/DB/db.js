const mongoose=require('mongoose');

async function connectDB(){

    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected successfully");
    }
    catch(err){
        console.log('MongoDB Connection error',err.message);
        process.exit(1);
    }
}

module.exports=connectDB;
