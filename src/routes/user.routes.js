
import { Router } from "express";
import { getHome } from "../controllers/user.controller.js";

const router = Router()

router.get("/", getHome)

export default router;