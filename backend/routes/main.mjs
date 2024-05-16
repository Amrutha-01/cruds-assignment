import { Router } from "express";
import CreateUserRoute from "./crudUserRoutes.mjs";
import getUserRoute from "./crudUserRoutes.mjs";

const router = Router();

router.use(CreateUserRoute);
router.use(getUserRoute);

export default router;
