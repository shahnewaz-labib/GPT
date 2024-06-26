import { Request, Response } from "express";
import {
  handleClientError,
  handleLibraryError
} from "../../utils/error/error.util";
import {
  CreateCommentBody,
  DeleteCommentBody,
  EditCommentBody
} from "./comment.schema";
import { commentService } from "./comment.service";

export const commentController = {
  createComment: async (
    req: Request<{}, {}, CreateCommentBody>,
    res: Response
  ) => {
    const { data } = req.body;
    const { comment } = data;
    const myId = res.locals.user.studentId;

    let newComment;

    try {
      newComment = await commentService.createComment({
        ...comment,
        sender: myId
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }

    if (!newComment)
      return handleClientError(500, "Could not create comment.", res);

    return res.status(201).json({ comment: newComment });
  },

  deleteComment: async (
    req: Request<{}, {}, DeleteCommentBody>,
    res: Response
  ) => {
    const { data } = req.body;
    const { commentId } = data;
    const myId = res.locals.user.studentId;

    try {
      const sender = await commentService.getSender(commentId);

      if (!sender)
        return handleClientError(500, "Could not delete comment.", res);
      if (sender !== myId)
        return handleClientError(
          401,
          "You are not authorized to delete this comment.",
          res
        );

      await commentService.deleteComment(commentId);
    } catch (error) {
      return handleLibraryError(error, res);
    }

    return res.status(200).json({ message: "Successfully deleted comment." });
  },

  editComment: async (req: Request<{}, {}, EditCommentBody>, res: Response) => {
    const { data } = req.body;
    const { commentId, text } = data;
    const myId = res.locals.user.studentId;

    try {
      const sender = await commentService.getSender(commentId);

      if (!sender)
        return handleClientError(500, "Could not edit comment.", res);
      if (sender !== myId)
        return handleClientError(
          401,
          "You are not authorized to edit this comment.",
          res
        );
      const comment = await commentService.editComment(commentId, text);

      if (!comment)
        return handleClientError(500, "Could not find comment.", res);

      return res.status(200).json({ comment });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  }
};
