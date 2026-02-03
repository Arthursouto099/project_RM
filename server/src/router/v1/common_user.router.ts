import { Router } from "express";
import commonUserController from "../../controller/common_user.controller";
import { validate } from "../../middlewares/zodMiddleware";
import { commonUserSchema } from "../../schemas/common_user.schema";
import authMiddleware from "../../middlewares/authMiddleware";

const commonUserRouter = Router();

commonUserRouter.post(
  "/",
  validate(commonUserSchema),
  commonUserController.post,
);

commonUserRouter.get(
  "/",
  authMiddleware,
  commonUserController.findForUniqueKey,
);
commonUserRouter.put("/", authMiddleware, commonUserController.put);
commonUserRouter.delete(
  "/",
  authMiddleware,
  commonUserController.deleteForUniqueKey,
);

commonUserRouter.post(
  "/relations",
  authMiddleware,
  commonUserController.addFriend,
);
commonUserRouter.get(
  "/relations",
  authMiddleware,
  commonUserController.getMutualFriends,
);
commonUserRouter.post(
  "/relation/request",
  authMiddleware,
  commonUserController.sendFriendRequest,
);
commonUserRouter.post(
  "/relation/accept",
  authMiddleware,
  commonUserController.acceptFriendRequest,
);
commonUserRouter.post(
  "/relation/deny",
  authMiddleware,
  commonUserController.denyFriendRequest,
);
commonUserRouter.get(
  "/relation/received",
  authMiddleware,
  commonUserController.getFriendRequestsForUser,
);
commonUserRouter.get(
  "/relation/friends",
  authMiddleware,
  commonUserController.getFriends,
);
commonUserRouter.get("/all", authMiddleware, commonUserController.get);

commonUserRouter.get(
  "/auth/me",
  authMiddleware,
  commonUserController.getPayload,
);
commonUserRouter.get("/find/me", authMiddleware, commonUserController.getMe);

export default commonUserRouter;
