import {Router} from "express";
import {jwks, ltiLaunch, ltiLogin} from "../controllers/lti.controller.js"
const router = Router();

//Creamos las rutas que necesita el protocolo LTI (LTI 1.3)
router.all("/launch", ltiLaunch);
router.get("/jwks.json", jwks);
router.all("/login", ltiLogin);
export default router;