/* eslint-disable no-restricted-syntax */
import jwt from "jsonwebtoken";
import db from "../../database.js";

const addTodo = async (args, { req, res }) => {
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
    for (const element of todoList) {
      if (element === args.todo) {
        return "This todo already exist";
      }
    }
    todoList.push(args.todo);
    const inputList = JSON.stringify(todoList);

    db.query(
      `UPDATE users SET todoList = ? WHERE username = ?`,
      [inputList, decoded.username],
      (err, results) => {
        if (err) throw err;
      },
    );
    return "Added todo";
  } catch (err) {
    return "Unauthorized";
  }
};

export default addTodo;
