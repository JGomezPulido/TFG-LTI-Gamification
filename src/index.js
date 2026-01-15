import httpsServer from "./app.js"
import { connectDB } from "./db.js";

connectDB();
const PORT = 3443;

httpsServer.listen(PORT);