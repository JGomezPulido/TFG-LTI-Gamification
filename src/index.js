import APP from "./app.js"
import { connectDB } from "./db.js";

connectDB();
const PORT = 3000;

APP.listen(PORT);