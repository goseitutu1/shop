const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Product {
        id: ID!
        title: String!
        description: String!
        price: Float!
        imageUrl: String!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        password: String
        createdAt: String
        updatedAt: String
        products: [Product!]!
    }

    type AuthData {
        user: User!
        token: String
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input ProductInputData {
        title: String!
        description: String!
        price: Float!
        imageUrl: String!
    }

    type RootQuery {
        login(email: String, password: String): AuthData
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createProduct(productInput: ProductInputData): Product!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
