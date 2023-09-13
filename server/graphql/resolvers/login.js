/* eslint-disable consistent-return */
import jwt from "jsonwebtoken";
import db from "../../database.js";

const getToken = async (args, { req, res }) => {
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
      { expiresIn: "1d" }, // set back to 60 later
    );

    const refreshToken = jwt.sign(
      { username: args.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });
    return { accessToken };
  }
};

export default getToken;
