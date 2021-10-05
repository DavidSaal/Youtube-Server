import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import User from "../models/user.js";

const signup = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "name not provided" });
  } else if (!req.body.lastName) {
    return res.status(400).json({ message: "last name not provided" });
  } else if (!req.body.email) {
    return res.status(400).json({ message: "email not provided" });
  } else if (
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)
  ) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  } else if (!req.body.password) {
    return res.status(400).json({ message: "password not provided" });
  } else if (!/^[a-zA-Z0-9]+$/.test(req.body.password)) {
    return res.status(400).json({ message: "password must be alphanumeric" });
  } else {
    // checks if email already exists
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((dbUser) => {
        if (dbUser) {
          return res.status(409).json({ message: "email already exists" });
        } else {
          // password hash
          bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "couldn't hash the password" });
            } else if (passwordHash) {
              return User.create({
                name: req.body.name,
                last_name: req.body.lastName,
                email: req.body.email,
                password: passwordHash,
              })
                .then(() => {
                  const token = jwt.sign({ email: req.body.email }, "secret", {
                    expiresIn: "1h",
                  });
                  res
                    .status(200)
                    .json({ message: "user created", token: token });
                })
                .catch((err) => {
                  console.log(err);
                  res
                    .status(502)
                    .json({ message: "error while creating the user" });
                });
            }
          });
        }
      })
      .catch((err) => {
        console.log("error", err);
        res.status(502).json({ message: "error while creating the user" });
      });
  }
};

const login = (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "email not provided" });
  } else if (!req.body.password) {
    return res.status(400).json({ message: "password not provided" });
  } else {
    // checks if email exists
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(404).json({ message: "user not found" });
        } else {
          // password hash
          bcrypt.compare(
            req.body.password,
            dbUser.password.toString(),
            (err, compareRes) => {
              if (err) {
                console.log(err);
                // error while comparing
                res
                  .status(502)
                  .json({ message: "error while checking user password" });
              } else if (compareRes) {
                // password match
                const token = jwt.sign({ email: req.body.email }, "secret", {
                  expiresIn: "1h",
                });
                res
                  .status(200)
                  .json({ message: "user logged in", token: token });
              } else {
                // password doesn't match
                res.status(401).json({ message: "incorrect password" });
              }
            }
          );
        }
      })
      .catch((err) => {
        console.log("error", err);
        res.status(502).json({ message: "error while login in" });
      });
  }
};

const forgotPassword = (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "Email not provided" });
  } else if (!req.body.password) {
    return res.status(400).json({ message: "Password not provided" });
  } else if (!/^[a-zA-Z0-9]+$/.test(req.body.password)) {
    return res.status(400).json({ message: "password must be alphanumeric" });
  } else {
    // checks if email exists
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(404).json({ message: "User not found" });
        } else {
          // password hash
          bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Couldn't hash the password" });
            } else if (passwordHash) {
              return User.update(
                {
                  password: passwordHash,
                },
                {
                  where: {
                    email: req.body.email,
                  },
                }
              )
                .then(() => {
                  res.status(200).json({ message: "Password changed" });
                })
                .catch((err) => {
                  console.log(err);
                  res
                    .status(502)
                    .json({ message: "Error while updating the user" });
                });
            }
          });
        }
      })
      .catch((err) => {
        console.log("error", err);
        res.status(502).json({ message: "Error while updating the user" });
      });
  }
};

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "not authenticated" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "could not decode the token" });
  }
  if (!decodedToken) {
    res.status(401).json({ message: "unauthorized" });
  } else {
    res.status(200).json({ message: "here is your resource" });
  }
};

export { signup, login, forgotPassword, isAuth };
