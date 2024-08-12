/*  CREATE MIDDLEWARE IN UTILS FOLDER TO CHECK
    IF USER IS TRYING TO COMMENT ON THEIR OWN REVIEW!! */
const express = require("express");
const commentRouter = express.Router();

const {
  createComment,
  updateComment,
  deleteComment,
} = require("../db/comments");
const {
  checkIsNotUserReview,
  checkCommentData,
  checkIsUserComment,
} = require("./utils");

// user will be set to req.user as token will be required for comment functions

// POST /api/comment/review/:reviewId
commentRouter.post(
  "/review/:reviewId",
  // check user is not author of review
  // then check user provided text for comment
  checkIsNotUserReview,
  checkCommentData,
  async (req, res, next) => {
    try {
      const newComment = await createComment({
        ...req.body,
        authorId: req.user.id,
        reviewId: req.params.reviewId,
      });

      res.status(201).send({ newComment });
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// PUT /api/comment/:id
commentRouter.put(
  "/:id",
  //  check user is author of comment and text data was provided
  checkIsUserComment,
  checkCommentData,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const putComment = await updateComment(id, text);

      res.send({ putComment });
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

//  DELETE /api/comment/:id
commentRouter.delete("/:id", checkIsUserComment, async (req, res, next) => {
  try {
    await deleteComment(req.params.id);

    res.sendStatus(204);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = commentRouter;
