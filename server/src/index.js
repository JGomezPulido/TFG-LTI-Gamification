//En este archivo simplemente ponemos en marcha los servidores y hacemos las comunicaciones iniciales con la base de datos, la configuración de ambas partes está en app.js y db.js, respectivamente

import httpsServer from "./app.js"
import { connectDB } from "./db.js";

connectDB();
httpsServer.listen(process.env.PORT);