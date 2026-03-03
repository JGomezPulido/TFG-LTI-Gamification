import { Router } from "express";

import { 
    awardBadge,
    createBadge,
    deleteBadge,
    updateBadge,
    getBadges,
    getBadge,
    getAssertions,
} from "../controllers/badges.controller.js";

import { authRequired } from "../middlewares/validateToken.js";
import { roleRequired, courseRequired } from "../middlewares/validateRole.js";
const router = Router();

//Rutas de la API
//Esta primera deberian de llamarse assertions para cumplir con el standard OpenBadges
//Devuelve las Badges asignadas a un usuario
router.post("/badges/award/:userid", authRequired, courseRequired, roleRequired("Instructor"), awardBadge)

//badges CRUD
router.post("/badges", authRequired, courseRequired, roleRequired("Instructor"), createBadge);
router.get("/badges", authRequired, courseRequired, getBadges);
router.get("/badges/badge/:id", authRequired, courseRequired, getBadge);
router.delete("/badges/:id", authRequired, courseRequired, roleRequired("Instructor"), deleteBadge);
router.put("/badges/:id", authRequired, courseRequired, roleRequired("Instructor"), updateBadge);
router.post("/badges/award/:badge/target/:user", authRequired, courseRequired, roleRequired("Instructor"), awardBadge)
router.get("/assertions", authRequired, courseRequired, getAssertions);

export default router;