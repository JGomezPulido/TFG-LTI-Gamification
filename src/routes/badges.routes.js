import { Router } from "express";

import { 
    getUserBadges,
    awardBadge,
    createBadge,
    deleteBadge,
    updateBadge,
    getBadges,
    getBadge,
} from "../controllers/badges.controller.js";

import { authRequired } from "../middlewares/validateToken.js";
import { roleRequired } from "../middlewares/validateRole.js";
const router = Router();

//Rutas de la API
//Esta primera deberian de llamarse assertions para cumplir con el standard OpenBadges
//Devuelve las Badges asignadas a un usuario
router.post("/badges/award/:userid", authRequired, roleRequired("Instructor"), awardBadge)

//badges CRUD
router.get("/badges", authRequired, getBadges);
router.get("/badges/:id", authRequired, getBadge);
router.post("/badges", authRequired, roleRequired("Instructor"), createBadge);
router.delete("/badges/:id", authRequired, roleRequired("Instructor"), deleteBadge);
router.put("/badges/:id", authRequired, roleRequired("Instructor"), updateBadge);

export default router;