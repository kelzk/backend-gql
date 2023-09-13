import dotenv from "dotenv";
import getUserFields from "./me.js";
import createUser from "./signup.js";
import getToken from "./login.js";
import refreshAccessToken from "./refreshToken.js";
import clearCookie from "./logout.js";
import addTodo from "./createTodo.js";
import modifyTodo from "./updateTodo.js";
import removeTodo from "./deleteTodo.js";

dotenv.config();

const resolvers = {
  Query: {
    me: (parent, args, context) => getUserFields(context),
  },
  Mutation: {
    login: (parent, args, context) => getToken(args, context),
    signup: (parent, args) => createUser(args),
    refreshToken: (parent, args, context) => refreshAccessToken(context),
    logout: (parent, args, context) => clearCookie(context),
    createTodo: (parent, args, context) => addTodo(args, context),
    updateTodo: (parent, args, context) => modifyTodo(args, context),
    deleteTodo: (parent, args, context) => removeTodo(args, context),
  },
};

export default resolvers;
