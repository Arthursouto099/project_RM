import { Prisma } from "@prisma/client";
import prisma from "../prisma.config";
import PostErrorHandler from "../errors/PostErrorHandler";
import { Pagination } from "../interfaces/Pagination";
import { getSkipQuantity } from "../utils";

export const UserRequiredProps = {
  id_user: true,
  username: true,
  profile_image: true,
  nickname: true,
};

interface commentUpdateProps {
  data: string;
  id_comment: string;
}

export const commentService = {
  createComment: async (
    data: { content: string },
    {
      id_user,
      id_post,
      parentCommentId,
    }: { id_user: string; id_post: string; parentCommentId?: string }
  ) => {
    try {
      const createData: Prisma.CommentCreateInput = {
        content: data.content,
        post: { connect: { id_post } },
        user: { connect: { id_user } },
      };

      if (parentCommentId) {
        createData.parentComment = { connect: { id_comment: parentCommentId } };
      }

      return await prisma.comment.create({ data: createData });
    } catch (e) {
      throw PostErrorHandler.internal("Não foi possivel criar o comentario", e);
    }
  },

  findAllCommentsByPost: async (
    pagination: Pagination,
    { id_post }: { id_post: string }
  ) => {
    return (
      (await prisma.comment.findMany({
        where: { id_post },
        skip: getSkipQuantity(pagination),
        take: pagination.limit,
        include: {
          replies: { include: { user: { select: UserRequiredProps } } },
          user: { select: UserRequiredProps },
        },
        orderBy: { createdAt: "desc" },
      })) ?? []
    );
  },

  findAllCommentsByPostNotParentComment: async (
    pagination: Pagination,
    { id_post }: { id_post: string }
  ) => {
    return await prisma.comment.findMany({
      where: {
        id_post,
        parentCommentId: null,
      },
      skip: getSkipQuantity(pagination),
      take: pagination.limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: UserRequiredProps,
        },
        replies: {
          
          take: 100,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: UserRequiredProps,
            },
          },
        },
      },
    });
  },

  findRepliesByIdComment: async ({
    id_comment,
    pagination,
  }: {
    id_comment: string;
    pagination: Pagination;
  }) => {
    return (
      (await prisma.comment.findMany({
        skip: getSkipQuantity(pagination),
        take: pagination.limit,
        orderBy: {createdAt: "desc"},
        where: { parentCommentId: id_comment },
        include: { user: { select: UserRequiredProps } },
      })) ?? []
    );
  },

  findCommentById: async ({ id_comment }: { id_comment: string }) => {
    const findComment = await prisma.comment.findFirst({
      where: { id_comment: id_comment },
      include: {
        user: {
          select: UserRequiredProps,
        },
        replies: {
          include: {
            user: {
              select: UserRequiredProps,
            },
          },
        },
      },
    });

    return findComment ?? null;
  },

  deleteComment: async ({ id_comment }: { id_comment: string }) => {
    try {
      return await prisma.comment.delete({ where: { id_comment } });
    } catch (e) {
      throw PostErrorHandler.internal(
        "Não foi possivel deletar o comentario",
        e
      );
    }
  },

  putComment: async ({ id_comment, data }: commentUpdateProps) => {
    try {
      return await prisma.comment.update({
        where: { id_comment },
        data: { content: data },
      });
    } catch (e) {
      throw PostErrorHandler.internal(
        "Não foi possivel editar o comentario",
        e
      );
    }
  },
};

export default commentService;
