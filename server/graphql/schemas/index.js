const typeDefs = `#graphql
  type User {
    id: Int!
    username: String!
    todoList: [String]!
  }

  type Token {
    accessToken: String!
    refreshToken: String!
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
    signup(username: String!,password: String!): String!
  }
`;

export default typeDefs;
