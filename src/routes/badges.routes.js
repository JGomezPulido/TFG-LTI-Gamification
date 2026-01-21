import { Router } from "express";

import { getUserBadges } from "../controllers/badges.controller.js";
const router = Router();

//Rutas de la API
router.get("/getUserBadges/:userid", getUserBadges);
export default router;