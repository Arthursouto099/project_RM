import { Request, Response, NextFunction } from "express";
import commentService from "../services/comment.service";
import { responseOk } from "../config/responses/app.response";
import { CustomRequest } from "../types/CustomRequest";
import { io } from "../app";
import { emitSinalByWebSocket } from "../interfaces/Socket";

const checkParentCommentId = (req: CustomRequest): string | undefined => {
  return req.query.parentCommentId && req.query.parentCommentId !== "undefined"
    ? String(req.query.parentCommentId)
    : undefined;
};

const commentController = {
  findComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await commentService.findCommentById({
        id_comment: req.params.id_comment,
      });
      responseOk(res, "Comentario Encontrado", comment, 200);
    } catch (e) {
      next(e);
    }
  },

  findComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

      const { id_post } = req.params;

      const onlyParentsRaw = req.query.onlyParents;
      const onlyParents =
        onlyParentsRaw === "true" ||
        onlyParentsRaw === "1" ||
        onlyParentsRaw === "yes";

      const onlyRepliesRaw = req.query.onlyReplies;
      const onlyReplies =
        onlyRepliesRaw === "true" ||
        onlyRepliesRaw === "1" ||
        onlyRepliesRaw === "yes";

      if (!id_post) {
        res.status(400).json({ message: "id_post é obrigatório" });
        return;
      }

      // Evita combinações ambíguas
      if (onlyParents && onlyReplies) {
        res.status(400).json({
          message: "Use apenas um filtro: onlyParents OU onlyReplies",
        });
        return;
      }

      if (onlyParents) {
        const comments =
          await commentService.findAllCommentsByPostNotParentComment(
            { page, limit },
            { id_post }
          );
        responseOk(res, "Consulta realizada com sucesso", comments, 200);
        return;
      }

      if (onlyReplies) {
        const comments = await commentService.findAllCommentsByPost(
          { page, limit },
          { id_post }
        );
        responseOk(res, "Consulta realizada com sucesso", comments, 200);
        return;
      }

      const comments = await commentService.findAllCommentsByPost(
        { page, limit },
        { id_post }
      );

      responseOk(res, "Consulta realizada com sucesso", comments, 200);
    } catch (error) {
      next(error);
    }
  },

  createComment: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const parentCommentId = checkParentCommentId(req);

    try {
      const comment = await commentService.createComment(
        { content: req.body.content },
        {
          id_post: req.body.id_post,
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          id_user: req.userLogged?.id_user!,
          parentCommentId,
        }
      );

      // caso tenha o id de um comentario pai
      // neste caso eu retorno o comentario pai completo com todas as repostas
      if (parentCommentId)
        emitSinalByWebSocket({
          io,
          toString: "commentRoom",
          emitString: "replyCreated",
          args: commentService.findCommentById({
            id_comment: comment.id_comment,
          }),
        });
      else
        emitSinalByWebSocket({
          io,
          toString: "commentRoom",
          emitString: "commentCreated",
          args: await commentService.findCommentById({
            id_comment: comment.id_comment,
          }),
        });

      responseOk(res, "comentario criado com sucesso", comment, 200);
    } catch (e) {
      next(e);
    }
  },

  putComment: async (req: CustomRequest, res: Response, next: NextFunction) => {
    const parentCommentId = checkParentCommentId(req);

    try {
      const comment = await commentService.putComment({
        id_comment: req.params.id_comment,
        data: req.body.content,
      });

      if (parentCommentId)
        emitSinalByWebSocket({
          io,
          toString: "commentRoom",
          emitString: "replyUpdated",
          args: await commentService.findCommentById({
            id_comment: comment.id_comment,
          }),
        });
      else
        emitSinalByWebSocket({
          io,
          toString: "commentRoom",
          emitString: "commentUpdated",
          args: await commentService.findCommentById({
            id_comment: comment.id_comment,
          }),
        });

      responseOk(res, "comentario editado com sucesso", comment, 200);
    } catch (e) {
      next(e);
    }
  },

  findRepliesByParentId: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    try {
      const replies = await commentService.findRepliesByIdComment({
        id_comment: req.params.id_comment,
        pagination: {
          page,
          limit,
        },
      });
      responseOk(res, "consulta feita com sucesso", replies, 200);
    } catch (e) {
      next(e);
    }
  },

  deleteComment: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const parentCommentId = checkParentCommentId(req);

    try {
      const comment = await commentService.deleteComment({
        id_comment: req.params.id_comment,
      });

      if (parentCommentId) io.to("commentRoom").emit("replyDeleted", comment);
      else io.to("commentRoom").emit("commentDeleted", comment);

      if (parentCommentId)
        emitSinalByWebSocket({
          io,
          toString: "commentRoom",
          emitString: "replyDeleted",
          args: comment,
        });
      else
        emitSinalByWebSocket({
          io,
          toString: "commentRoom",
          emitString: "commentDeleted",
          args: comment,
        });

      responseOk(res, "comentario deletado com sucesso");
    } catch (e) {
      next(e);
    }
  },
};

export default commentController;
