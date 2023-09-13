import jwt from "jsonwebtoken";
import db from "../../database.js";

const getUser = () =>
  new Promise((resolve, reject) => {
    db.query("SELECT * FROM users", (error, results) => {
      if (error) reject(error);
      resolve(results[0]);
    });
  });

const getUserFields = ({ req, res }) => {
  // Bearer token
  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return getUser().then((value) => {
      const todoList = JSON.parse(value.todoList);
      return { id: value.id, username: value.username, todoList };
    });
  } catch (err) {
    return "Unauthorized";
  }
};

export default getUserFields;
