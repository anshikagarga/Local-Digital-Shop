import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./Config/db.js";

dotenv.config();

console.log("MONGO_URL =", process.env.MONGO_URL);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});