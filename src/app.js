import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import https from "https";
import fs from "fs";
import cors from 'cors';

import ltiRoutes from "./routes/lti.routes.js"
import badgeRoutes from "./routes/badges.routes.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";

export const APP = express();

//Configuración para HTTPS (necesario para que las cookies de sesion cross-site funcionen en Google Chrome)
APP.set('trust proxy', 1);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var privateKey = fs.readFileSync("certs/key.pem", 'utf8')
var certificate = fs.readFileSync("certs/server.crt", 'utf8');
var credentials = {key: privateKey, cert: certificate};
//Configuración CORS (para que nuestro frontend no tenga problemas al hacer peticiones)
APP.use(cors({
    origin: process.env.FRONTEND_IP,
    credentials: true,
}));

//Middlewares de express 
//urlencoded para leer los parametros de la url
//json para que se pueda leer JSON de las requests REST (express no puede hacer esto por defecto)
APP.use(express.urlencoded({extended: true,}));
APP.use(express.json());
APP.use(cookieParser())

APP.use(morgan('dev'));

//Configuración del middleware de sesión, en este caso necesitamos activar las cross-site cookies tanto para comunicarnos con nuestro frontend, como con moodle
const sess = session({
    secret: process.env.TK_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: false,
        sameSite: "none",
        partitioned: true,
    }
});
APP.use(sess);

//Por último, añadimos nuestras rutas de la api, con el prefijo /api/ por claridad y consistencia.
APP.use("/lti", ltiRoutes);
APP.use("/api", badgeRoutes);
APP.use("/api", authRoutes);
APP.use(`/api`, courseRoutes);

//Creamos y exportamos el servidor que después iniciamos en index.js
const httpsServer = https.createServer(credentials, APP);
export default httpsServer;