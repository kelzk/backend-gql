/* eslint-disable consistent-return */
import bcrypt from "bcrypt";
import db from "../../database.js";

const saltRounds = 10;

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
      bcrypt.hash(args.password, saltRounds, (err, hash) => {
        db.query(
          "INSERT INTO users VALUES (?, ?, ?, ?, ?)",
          [obj.idLength + 1, hash, args.username, "[]", args.role],
          (error, results) => {
            if (error) throw error;
          },
        );
      });
    }
    return obj.usernameExist;
  });
  if (!usernameExist) return "Successfully signup";
  if (usernameExist) return "User already exist";
};

export default createUser;
