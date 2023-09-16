/* eslint-disable consistent-return */
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../../database.js";

dotenv.config();
const getAllUsers = async ({ req, res }) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.role === "user") return "unauthorized";
    if (decoded.role === "admin") {
      const result = await new Promise((resolve, reject) => {
        db.query(
          "SELECT id, username, todoList FROM users",
          (error, results) => {
            if (error) throw error;
            const answer = [];
            results.forEach((element) => {
              const obj = {
                id: element.id,
                username: element.username,
                todoList: JSON.parse(element.todoList),
              };
              answer.push(obj);
            });
            resolve(answer);
          },
        );
      });
      return result;
    }
  } catch (err) {
    return "unauthorized";
  }
};

export default getAllUsers;
