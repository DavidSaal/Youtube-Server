import express from "express";

import { signup, login, forgotPassword, isAuth } from "../controllers/auth.js";
import { addCategory, getCategories } from "../controllers/categories.js";
import { addNewLink, deleteLink } from "../controllers/links.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/addCategory", addCategory);

router.post("/addNewLink", addNewLink);

router.post("/deleteLink", deleteLink);

router.post("/getCategories", getCategories);

router.post("/forgotPassword", forgotPassword);

router.get("/private", isAuth);

router.get("/public", (req, res, next) => {
  res.status(200).json({ message: "here is your public resource" });
});

router.use("/", (req, res, next) => {
  res.status(404).json({ error: "page not found" });
});

export default router;
