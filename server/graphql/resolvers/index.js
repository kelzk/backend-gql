/* eslint-disable consistent-return */
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../../database.js";

dotenv.config();

const getUser = () =>
  new Promise((resolve, reject) => {
    db.query("SELECT * FROM users", (error, results) => {
      if (error) reject(error);
      resolve(results[0]);
    });
  });

const getUserFields = (context) => {
  // Bearer token
  const token = context.req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return getUser().then((value) => {
    const todoList = JSON.parse(value.todoList);
    return { id: value.id, username: value.username, todoList };
  });
};

const createUser = async (args) => {
  const checkDB = new Promise((resolve, reject) => {
    db.query("SELECT username FROM users", (error, results) => {
      if (error) throw error;
      let usernameExist = false;
      const idLength = results.length;
      if (results.length) {
        /* eslint-disable no-restricted-syntax */
        for (const x of results) {
          if (x.username === args.username) {
            usernameExist = true;
            break;
          }
        }
      }
      resolve({ idLength, usernameExist });
    });
  });
  /*  eslint-disable promise/catch-or-return, promise/always-return  */
  const usernameExist = await checkDB.then((obj) => {
    if (!obj.usernameExist) {
      db.query(
        "INSERT INTO users VALUES (?, ?, ?, ?)",
        [obj.idLength + 1, args.password, args.username, "[]"],
        (error, results) => {
          if (error) throw error;
        },
      );
    }
    return obj.usernameExist;
  });
  if (!usernameExist) return "Successfully signup";
  if (usernameExist) return "User already exist";
};

const getToken = async (args, context) => {
  const records = await new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [args.username, args.password],
      (error, results) => {
        if (error) throw error;
        resolve(results);
      },
    );
  });
  if (!records.length) {
    return "Wrong username or password";
  }
  if (records.length) {
    const accessToken = jwt.sign(
      { username: args.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 60 },
    );

    const refreshToken = jwt.sign(
      { username: args.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );
    context.res.cookie("authorization", accessToken, {
      secure: true,
      maxAge: 60,
    });
    context.res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    return { accessToken, refreshToken };
  }
};

const resolvers = {
  Query: {
    me: (parent, args, context) => getUserFields(context),
  },
  Mutation: {
    login: (parent, args, context) => getToken(args, context),
    signup: (parent, args) => createUser(args),
  },
};

export default resolvers;
