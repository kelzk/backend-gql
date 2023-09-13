/* eslint-disable consistent-return */
import jwt from "jsonwebtoken";
import db from "../../database.js";

const modifyTodo = async (args, { req, res }) => {
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
    if (todoList.find((str) => str === args.newTodo)) {
      return "This todo already exist";
    }
    for (let i = 0; i < todoList.length; i++) {
      if (todoList[i] === args.oldTodo) {
        todoList[i] = args.newTodo;
        const inputList = JSON.stringify(todoList);

        db.query(
          `UPDATE users SET todoList = ? WHERE username = ?`,
          [inputList, decoded.username],
          (err, results) => {
            if (err) throw err;
          },
        );
        return "updated todo";
      }
    }
  } catch (err) {
    return "Unauthorized";
  }
};

export default modifyTodo;
