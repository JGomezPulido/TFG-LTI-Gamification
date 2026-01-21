import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', login);
router.post('/login', register);

export default router;