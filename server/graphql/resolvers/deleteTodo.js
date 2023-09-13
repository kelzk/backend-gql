import jwt from "jsonwebtoken";
import db from "../../database.js";

const removeTodo = async (args, { req, res }) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const todoList = await new Promise((resolve, reject) => {
      db.query(
        "SELECT todoList FROM users WHERE username = ?",
        [decoded.username],
        (err, results) => {
          if (err) throw err;
          resolve(JSON.parse(results[0].todoList));
        },
      );
    });
    const filteredList = todoList.filter((str) => str !== args.todo);
    const inputList = JSON.stringify(filteredList);

    db.query(
      `UPDATE users SET todoList = ? WHERE username = ?`,
      [inputList, decoded.username],
      (err, results) => {
        if (err) throw err;
      },
    );
    return "deleted todo";
  } catch (err) {
    return "Unauthorized";
  }
};

export default removeTodo;
