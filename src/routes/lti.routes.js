import {Router} from "express";
import {jwks, launch, login, index, getBadge} from "../controllers/lti.controller.js"
const router = Router();

router.post("/launch", launch);
router.get("/jwks.json", jwks);
router.all("/login", login);
router.get("/index.html", index)
router.get("/getBadge/:userid", getBadge)
export default router;