
import express from "express";
import session from "express-session";
import https from "https"
import fs from "fs"
import ltiRoutes from "./routes/lti.routes.js"

export const APP = express();

APP.set('trust proxy', 1);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var privateKey = fs.readFileSync("certs/key.pem", 'utf8')
var certificate = fs.readFileSync("certs/server.crt", 'utf8');
var credentials = {key: privateKey, cert: certificate};

APP.use(express.urlencoded({extended: true,}));
APP.use(express.json());
//APP.enable('trust proxy');
const sess = session({
    secret: process.env.TK_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'backend_session',
        secure: true,
        httpOnly: true,
        sameSite: "none",
    }
    });

APP.use(sess);


APP.use("/api/", ltiRoutes);

const httpsServer = https.createServer(credentials, APP);
export default httpsServer;