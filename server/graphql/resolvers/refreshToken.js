/* eslint-disable consistent-return */
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const refreshAccessToken = ({ req, res }) => {
  try {
    const encryptedStr = req.headers.refresh.split(" ")[1];
    const myKey = crypto.createDecipheriv(
      "aes-128-cbc",
      process.env.KEY,
      process.env.IV,
    );
    let myStr = myKey.update(encryptedStr, "hex", "utf8");
    myStr += myKey.final("utf8");

    const decoded = jwt.verify(myStr, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 60 },
    );
    return { accessToken };
  } catch (err) {
    return "unauthorized";
  }
};

export default refreshAccessToken;
