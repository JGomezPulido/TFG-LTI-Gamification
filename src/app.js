
import express from "express";
import session from "express-session";
import https from "https"
import fs from "fs"
import {TK_SECRET, MOODLE_IP} from "./config.js"

import ltiRoutes from "./routes/lti.routes.js"

export const APP = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var privateKey = fs.readFileSync("certs/key.pem", 'utf8')
var certificate = fs.readFileSync("certs/server.crt", 'utf8');
var credentials = {key: privateKey, cert: certificate};

APP.use(express.urlencoded({extended: true,}));
APP.use(express.json());
//APP.enable('trust proxy');
APP.use(session({
    secret: TK_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: false,
        sameSite: "none",
    },
}));


APP.use("/api/", ltiRoutes);

const httpsServer = https.createServer(credentials, APP);
export default httpsServer;

//APP.use(proxy(MOODLE_IP));
