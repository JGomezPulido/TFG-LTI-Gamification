import {Router} from "express";
import {jwks, ltiLaunch, ltiLogin} from "../controllers/lti.controller.js"
import { checkLTI } from "../middlewares/LTI.js";
const router = Router();

//Creamos las rutas que necesita el protocolo LTI (LTI 1.3)
router.all("/ltiLaunch", checkLTI, ltiLaunch);
router.get("/jwks.json", jwks);
router.all("/ltiLogin", ltiLogin);
export default router;