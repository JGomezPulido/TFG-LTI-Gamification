import {Router} from "express";
import {jwks, launch, login, index} from "../controllers/lti.controller.js"
const router = Router();

router.post("/launch", launch);
router.get("/jwks.json", jwks);
router.all("/login", login);
router.get("/index.html", index)

export default router;