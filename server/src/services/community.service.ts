import { Prisma } from "@prisma/client";
import prisma from "../prisma.config";

const communityService = {
  createCommunity: async (
    data: Pick<
      Prisma.CommunityCreateInput,
      "name" | "description" | "community_image"
    >,
    id_owner: string,
  ) => {
    return prisma.community.create({
      data: {
        name: data.name,
        description: data.description,
        community_image: data.community_image,
        owner: { connect: { id_user: id_owner } },
        members: {
          connect: { id_user: id_owner },
        },
      },
      include: {
        chats: true,
        members: { select: { id_user: true, nickname: true, username: true } },
        owner: { select: { id_user: true, nickname: true, username: true } },
      },
    });
  },

  findAllCommunitiesWhere: async (where: Prisma.CommunityWhereInput) => {
    return prisma.community.findMany({
      where,
      include: {
        owner: {
          select: {
            id_user: true,
            nickname: true,
            email: true,
            profile_image: true,
          },
        },
        members: {
          select: {
            id_user: true,
            nickname: true,
            email: true,
            profile_image: true,
          },
        },
        chats: true,
      },
    });
  },

  findAllCommunities: async (id_user: string) => {
    const data = await prisma.community.findMany({
      where: {
        members: {
          none: {
            id_user,
          },
        },
      },
      include: {
        owner: {
          select: {
            id_user: true,
            nickname: true,
            email: true,
            profile_image: true,
          },
        },
        members: {
          select: {
            id_user: true,
            nickname: true,
            email: true,
            profile_image: true,
          },
        },
        chats: true,
      },
    });
    return data;
  },

  updateCommunity: async (
    where: Prisma.CommunityWhereUniqueInput,
    data: Pick<
      Prisma.CommunityUpdateInput,
      "name" | "description" | "community_image"
    >,
  ) => {
    return prisma.community.update({
      where,
      data,
    });
  },

  deleteCommunity: async (where: Prisma.CommunityWhereUniqueInput) => {
    return await prisma.$transaction(async (ctx) => {
      const { id_community } = where;

      const chats = await ctx.chat.findMany({
        where: { communityId: id_community },
        select: { id_chat: true },
      });

      const chatIds = chats.map((c) => c.id_chat);

      if (chatIds.length > 0) {
        await ctx.message.deleteMany({
          where: { id_chat: { in: chatIds } },
        });

        await ctx.chatUser.deleteMany({
          where: { id_chat: { in: chatIds } },
        });
      }

      await ctx.chat.deleteMany({
        where: { communityId: id_community },
      });

      return ctx.community.delete({
        where: { id_community },
      });
    });
  },

  addMember: async (
    id_user: string,
    where: Prisma.CommunityWhereUniqueInput,
  ) => {
    const result = await prisma.$transaction(async (ctx) => {
      const find = await ctx.community.findFirst({
        where: {
          ...where,
          members: {
            some: {
              id_user,
            },
          },
        },
        include: {
          members: {
            select: {
              id_user: true,
              nickname: true,
              email: true,
              profile_image: true,
            },
          },
          owner: {
            select: {
              id_user: true,
              nickname: true,
              email: true,
              profile_image: true,
            },
          },
        },
      });

      if (find && find.id_owner === id_user)
        throw new Error("você já e o dono dessa comunidade");
      if (find) return find;

      return ctx.community.update({
        where,
        data: {
          members: {
            connect: {
              id_user,
            },
          },
        },
        include: {
          members: {
            select: {
              id_user: true,
              nickname: true,
              email: true,
              profile_image: true,
            },
          },
          owner: {
            select: {
              id_user: true,
              nickname: true,
              email: true,
              profile_image: true,
            },
          },
        },
      });
    });

    return result;
  },

  removeMember: async (
    id_user: string,
    where: Prisma.CommunityWhereUniqueInput,
  ) => {
    const result = await prisma.$transaction(async (ctx) => {
      const find = await ctx.community.findFirst({
        where: {
          ...where,
          members: {
            some: {
              id_user,
            },
          },
        },
        include: {
          members: {
            select: {
              id_user: true,
              nickname: true,
              email: true,
              profile_image: true,
            },
          },
          owner: {
            select: {
              id_user: true,
              nickname: true,
              email: true,
              profile_image: true,
            },
          },
        },
      });

      if (find && find.id_owner === id_user)
        throw new Error("Você não pode sair da sua comunidade.");
      if (!find) throw new Error("Você não faz parte dessa comunidade");

      return ctx.community.update({
        where,
        data: {
          members: {
            disconnect: {
              id_user,
            },
          },
        },
        include: {
          members: {
            select: {
              id_user: true,
              nickname: true,
              email: true,
              profile_image: true,
            },
          },
          owner: {
            select: {
              id_user: true,
              nickname: true,
              email: true,
              profile_image: true,
            },
          },
        },
      });
    });

    return result;
  },

  addChat: async (
    data: Pick<Prisma.ChatCreateInput, "isGroup" | "name">,
    { id_community, id_user }: { id_community: string; id_user: string },
  ) => {
    return await prisma.$transaction(async (ctx) => {
      const community = await ctx.community.findFirst({
        where: { id_community },
        select: { id_owner: true },
      });

      if (community?.id_owner !== id_user)
        throw new Error("Somente o dono da comunidade pode criar chats");

      return await ctx.chat.create({
        data: {
          isGroup: data.isGroup,
          name: data.name,
          community: {
            connect: {
              id_community,
            },
          },
          participants: {
            create: {
              id_user,
              role: "ADMIN",
            },
          },
        },
        include: {
          community: true,
          participants: {
            select: { user: { select: { email: true, username: true } } },
          },
        },
      });
    });
  },
};

export default communityService;
