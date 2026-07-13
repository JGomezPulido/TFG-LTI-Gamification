import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { courseRequired, roleRequired, Roles } from "../middlewares/validateRole.js";
import { 
    getMission, 
    getAllMissions, 
    createMission,
    updateMission, 
    deleteMission,
    getUserMissions, 
    completeMission,
    giveMission,
    enableMission, 
} from "../controllers/missions.controller.js";

const router = Router();

router.post(`/mission/`, authRequired, courseRequired, roleRequired(Roles.Instructor), createMission);
router.get(`/mission/:id`, authRequired, courseRequired, getMission);
router.get(`/mission`, authRequired, courseRequired, getAllMissions)
router.put(`/mission/:id`, authRequired, courseRequired, roleRequired(Roles.Instructor), updateMission);
router.delete(`/mission/:id`, authRequired, courseRequired, roleRequired(Roles.Instructor), deleteMission);

router.get(`/mission/user/:user`, authRequired, courseRequired, getUserMissions);
router.post(`/mission/:id/enable`, authRequired, courseRequired, roleRequired(Roles.Instructor), enableMission);
router.put(`/mission/:id/user/:user`, authRequired, courseRequired, roleRequired(Roles.Instructor), giveMission);
router.put(`/mission/:id/user/:user/reward`, authRequired, courseRequired, roleRequired(Roles.Instructor), completeMission);

export default router;