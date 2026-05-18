
import { Router } from "express";
import { getHome, postUser, loginUser, getSingleUser, getAll, deleteUser } from "../controllers/user.controller.js";
import { checkToken } from "../middleware/authMiddleware.js";

const router = Router()

router.get("/", getHome).post("/signup", postUser).post("/login", loginUser).get("/user/:id", checkToken, getSingleUser).get("/users", checkToken, getAll).delete("/delete-user/:id", checkToken, deleteUser)

export default router;