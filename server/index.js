import dotenv from "dotenv";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import db from "./database.js";
import typeDefs from "./graphql/schemas/index.js";
import resolvers from "./graphql/resolvers/index.js";

dotenv.config();
const app = express();
app.get("/", (req, res) => {
  db.query("SELECT id, username, todoList FROM users", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.listen(3000, () => {
  console.log("running restful api at 3000");
});
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT },
  context: ({ req, res }) => ({ req, res }),
});

console.log(`Running GraphQL server at ${url}graphql`);
