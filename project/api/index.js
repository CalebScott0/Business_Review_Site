const express = require("express");
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db/users");
const { requireUser } = require("./utils");

const apiRouter = express.Router();

// set req.user if available from log in
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  // if request does not need auth header, move on
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(
        token,
        process.env.JWT || "Super secret super safe"
      );
      //   if id is successfully made, set req.user
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch (e) {
      // 400 status on bad request
      res.status(400).send({
        name: "AuthorizationHeaderError",
        message: "Authorization Token Malformed",
      });
    }
  } else {
    // 400 status on bad request
    res.status(400).send({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

// /api/auth auth routes
apiRouter.use("/auth", require("./auth/auth"));

// /api/user routes
apiRouter.use("/user", requireUser, require("./user"));

// api/landing-page routes
apiRouter.use("/landing-page", require("./landingPage"));

// /api/businesses
apiRouter.use("/businesses", require("./businesses"));

// /api/categories
apiRouter.use("/categories", require("./categories"));

//  /api/review
apiRouter.use("/review", requireUser, require("./review"));

//  /api/comment
apiRouter.use("/comment", requireUser, require("./comment"));

module.exports = apiRouter;
