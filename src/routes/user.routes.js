
import { Router } from "express";
import { getHome, postUser } from "../controllers/user.controller.js";

const router = Router()

router.get("/", getHome).post("/post-user", postUser)

export default router;