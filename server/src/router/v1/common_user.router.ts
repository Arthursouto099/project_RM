import { Router } from "express";
import commonUserController from "../../controller/common_user.controller";
import { validate } from "../../middlewares/zodMiddleware";
import { commonUserSchema } from "../../schemas/common_user.schema";
import authMiddleware from "../../middlewares/authMiddleware";
// import { upload } from "../../controller/common_user.controller";


const commonUserRouter = Router()


commonUserRouter.post("/", validate(commonUserSchema) ,commonUserController.post)
commonUserRouter.get("/",  authMiddleware, commonUserController.findForUniqueKey)
commonUserRouter.delete("/",commonUserController.deleteForUniqueKey )
commonUserRouter.put("/:id_user", authMiddleware,commonUserController.put )
// commonUserRouter.post("/profile" , upload.single("image"), commonUserController.postImage )

export default commonUserRouter