
import express from "express";
import session from "express-session"
import {TK_SECRET} from "./config.js"

import ltiRoutes from "./routes/lti.routes.js"

const APP = express();

APP.use(express.urlencoded({extended: true,}));
APP.use(express.json());
APP.use(session({
    secret: TK_SECRET,
    resave: false,
    saveUninitialized: true,
}));


APP.use("/api/", ltiRoutes);
export default APP;