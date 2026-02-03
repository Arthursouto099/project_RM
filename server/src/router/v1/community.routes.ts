import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import communityController from "../../controller/communityController";

const communityRoutes = Router();

communityRoutes.post(
  "/create",
  authMiddleware,
  communityController.createCommunity,
);
communityRoutes.get("/all", authMiddleware, communityController.findAll);
communityRoutes.get(
  "/my/all",
  authMiddleware,
  communityController.findMyCommunities,
);
communityRoutes.get(
  "/part/all",
  authMiddleware,
  communityController.findAllCommunitiesWhereIHavePart,
);

communityRoutes.patch(
  "/:id_community",
  authMiddleware,
  communityController.updateCommunity,
);

communityRoutes.delete(
  "/:id_community",
  authMiddleware,
  communityController.deleteCommunity,
);

communityRoutes.patch(
    "/join/:id_community",
    authMiddleware,
    communityController.joinCommunity
)


communityRoutes.patch(
    "/out/:id_community",
    authMiddleware,
    communityController.outCommunity
)

communityRoutes.patch(
    "/add/chat/:id_community",
    authMiddleware,
    communityController.createChat
)


communityRoutes.get(
    "/chats/:id_community",
    authMiddleware,
    communityController.findChatsWhereIdCommunity
)

export default communityRoutes;
