const typeDefs = `#graphql
  type User {
    id: Int!
    username: String!
    todoList: [String]!
  }

  type Token {
    accessToken: String!
  }

  type Query {
    """
    Token is required to use authenticated api\n
    Set HTTP header "Authorization": "Bearer <token>"
    """
    me: User!
  }

  type Mutation {
    login(username: String!, password: String!): Token!
    signup(username: String!, password: String!): String!
    refreshToken: Token!
    logout: String!
    createTodo(todo: String!): String!
    updateTodo(oldTodo: String!, newTodo: String!): String!
    deleteTodo(todo: String!): String!
  }
`;

export default typeDefs;
