import {Router} from "express";
import {jwks, launch, login, getBadge} from "../controllers/lti.controller.js"
const router = Router();

//Creamos las rutas que necesita el protocolo LTI (LTI 1.3)
router.all("/launch", launch);
router.get("/jwks.json", jwks);
router.all("/login", login);

//Rutas de la API
router.get("/getBadge/:userid", getBadge)
export default router;