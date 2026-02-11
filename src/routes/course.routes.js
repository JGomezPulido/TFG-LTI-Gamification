import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { 
    getCourse,
    getUsers,
    profile,
    getUserByEmail,
    loginCourse,
    logoutCourse, 
    verifyCourse
} from "../controllers/course.controller.js";

const router = Router();
router.get('/profile', authRequired, profile);
router.get('/user/:email', getUserByEmail)
router.get('/course/users/:id', authRequired, getUsers);
router.get('/course/:id', authRequired, getCourse);
router.post('/course/:id/login', authRequired, loginCourse);
router.post('/course/logout', authRequired, logoutCourse);
router.get('/course/verify', authRequired, verifyCourse);

export default router;