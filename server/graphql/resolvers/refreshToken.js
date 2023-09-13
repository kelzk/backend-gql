/* eslint-disable consistent-return */
import jwt from "jsonwebtoken";

const refreshAccessToken = ({ req, res }) => {
  const refreshToken = req.body.token;
  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, payload) => {
        if (error) throw error;
        const accessToken = jwt.sign(
          { username: payload.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 60 },
        );
        return { accessToken };
      },
    );
  } catch (err) {
    return "unauthorized";
  }
};

export default refreshAccessToken;
