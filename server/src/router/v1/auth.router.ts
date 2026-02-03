import Router from "express";
import { validate } from "../../middlewares/zodMiddleware";
import { loginUserInputs } from "../../schemas/common_user.schema";
import auhtController from "../../controller/auth.controller";

const router = Router();

router.post("/login", validate(loginUserInputs), auhtController.login);

export default router;
