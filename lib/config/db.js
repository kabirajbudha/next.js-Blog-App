import mongoose from "mongoose";

export const ConnectDB = async () => {
    await mongoose.connect("mongodb+srv://omgomgomgomg161_db_user:FMgvWqqpodw4keP7@kabiraj-blog-app.dep9ywh.mongodb.net/?appName=kabiraj-blog-app")
    console.log("db connected")
}

