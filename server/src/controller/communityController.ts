import chatService from "../services/chat.service";
import communityService from "../services/community.service";
import { CustomRequest } from "../types/CustomRequest";
import { Response } from "express";

const communityController = {
  createCommunity: async (req: CustomRequest, response: Response) => {
    const data = await communityService.createCommunity(
      {
        ...req.body,
        owner: { connect: { id_user: req.userLogged?.id_user } },
      },
      req.userLogged?.id_user as string,
    );
    response.status(201).json({ data });
  },

  findAll: async (req: CustomRequest, response: Response) => {
    const data = await communityService.findAllCommunities(req.userLogged?.id_user as string,);
    response.status(200).json({ data });
  },

  findMyCommunities: async (req: CustomRequest, response: Response) => {
    const data = await communityService.findAllCommunitiesWhere({
      id_owner: req.userLogged?.id_user,
    });
    response.status(200).json({ data });
  },

  findAllCommunitiesWhereIHavePart: async (
    req: CustomRequest,
    response: Response,
  ) => {
    const data = await communityService.findAllCommunitiesWhere({
      members: {
        some: {
          id_user: req.userLogged?.id_user,
        },
      },
    });

    response.status(200).json({ data });
  },

  updateCommunity: async (req: CustomRequest, response: Response) => {
    const data = await communityService.updateCommunity(
      {
        id_community: req.params.id_community,
        id_owner: req.userLogged?.id_user,
      },
      {
        community_image: req.body.community_image,
        description: req.body.description,
        name: req.body.name,
      },
    );

    response.status(200).json({ data });
  },

  deleteCommunity: async (req: CustomRequest, response: Response) => {
    const data = await communityService.deleteCommunity({
      id_community: req.params.id_community,
      id_owner: req.userLogged?.id_user,
    });

    response.status(200).json({ data });
  },

  joinCommunity: async (req: CustomRequest, response: Response) => {
    const data = await communityService.addMember(
      req.userLogged?.id_user as string,
      { id_community: req.params.id_community },
    );
    response.status(201).json({ data });
  },

  outCommunity: async (req: CustomRequest, response: Response) => {
    const data = await communityService.removeMember(
      req.userLogged?.id_user as string,
      { id_community: req.params.id_community },
    );
    response.status(200).json({ data });
  },

  createChat: async (req: CustomRequest, response: Response) => {
    const data = await communityService.addChat(
      {
        isGroup: true,
        name: req.body.name,
      },
      {
        id_community: req.params.id_community,
        id_user: req.userLogged?.id_user as string,
      },
    );

    response.status(201).json({ data });
  },

  findChatsWhereIdCommunity: async (req: CustomRequest, response: Response) => {
    const data = await chatService.findChatsWhere({
      communityId: req.params.id_community,
    });

    response.status(200).json({ data });
  },
};

export default communityController;
