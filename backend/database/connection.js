import mongoose from "mongoose";

export const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "JOB_PORTAL_WITH_AUTOMATION",
        })
        console.log("connected to database successfully");
    } catch(error){
        console.log(`error occured while connection to database : ${error}`); 
    }
};