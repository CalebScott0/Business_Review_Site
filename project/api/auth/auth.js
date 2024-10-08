const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, getUserByUsername } = require("../../db/users");
const { checkUserData, checkUserExists } = require("./utils");

const authRouter = express.Router();

// path /api/auth

// POST /api/auth/register
authRouter.post(
  "/register",
  checkUserData,
  checkUserExists,
  async (req, res, next) => {
    try {
      const { password } = req.body;
      //   checkUserData / checkUserExists
      // hash pass
      const hashPass = await bcrypt.hash(password, +process.env.SALT || 7);
      //   create user
      const user = await createUser({ ...req.body, password: hashPass });

      //  create token with user id
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.JWT || "Super secret super safe",
        // set expiration to 24hrs
        { expiresIn: "1d" }
      );
      res.status(201).send({ token });
    } catch (error) {
      next(error);
    }
  }
);

//  POST /api/auth/login
authRouter.post("/login", checkUserData, async (req, res, next) => {
  // const user = await getUserByUsername(username);
  // console.log("user", user);
  try {
    const { username, password } = req.body;
    // find user by username
    const user = await getUserByUsername(username);
    if (!user) {
      return res
        .status(401)
        .send({ message: "No account found with that username" });
    }
    // run bcypt if login was NOT via OAuth, check user exists when you grab password from user
    const isSamePass = await bcrypt.compare(password, user?.password);

    // check there is a user and passwords match
    if (!user || !isSamePass) {
      return res.status(401).send({ message: "Invalid login credentials" });
    }

    // if user exists and passwords match, create token with user id
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT || "Super secret super safe",
      // set expiration to 24hrs (UTC)
      { expiresIn: "1d" }
    );

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
