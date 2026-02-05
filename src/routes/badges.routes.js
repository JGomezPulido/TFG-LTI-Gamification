import { Router } from "express";

import { 
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
router.get("/badges/:course", authRequired, getBadges);
router.get("/badges/:course/badge/:id", authRequired, getBadge);
router.post("/badges/:course", authRequired, roleRequired("Instructor"), createBadge);
router.delete("/badges/:id", authRequired, roleRequired("Instructor"), deleteBadge);
router.put("/badges/:id", authRequired, roleRequired("Instructor"), updateBadge);
router.post("/badges/award/course/:course/badge/:badge/target/:user", authRequired, roleRequired("Instructor"), awardBadge)

export default router;