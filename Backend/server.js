require("dotenv").config();
console.log("MONGO_URL =", process.env.MONGO_URL);

const app = require("./app");
const connectDB = require("./Config/db");


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});