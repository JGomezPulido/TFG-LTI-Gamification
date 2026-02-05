import { Router } from "express";
import { getUserByEmail, login, logout, profile, register, verify } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { getUsers } from "../controllers/course.controller.js";


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authRequired, profile);
router.get('/user/:email', getUserByEmail)
router.get('/course/users/:id', authRequired, getUsers);
router.get('/verify', verify)
export default router;