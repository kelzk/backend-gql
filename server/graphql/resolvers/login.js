/* eslint-disable consistent-return */
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import db from "../../database.js";

dotenv.config();

const getToken = async (args, { req, res }) => {
  const records = await new Promise((resolve, reject) => {
    db.query(
      "SELECT username, password, role FROM users WHERE username = ?",
      [args.username],
      (error, results) => {
        if (error) throw error;
        resolve(results);
      },
    );
  });
  if (!records.length) {
    return "Wrong username or password";
  }
  const match = await bcrypt.compare(args.password, records[0].password);
  if (match) {
    const accessToken = jwt.sign(
      { username: args.username, role: records[0].role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }, // set back to 60 later
    );

    const refreshToken = jwt.sign(
      { username: args.username, role: records[0].role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );
    const myKey = crypto.createCipheriv(
      "aes-128-cbc",
      process.env.KEY,
      process.env.IV,
    );
    let myStr = myKey.update(refreshToken, "utf8", "hex");
    myStr += myKey.final("hex");
    res.cookie("refreshToken", myStr, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });
    return { accessToken };
  }
};

export default getToken;
