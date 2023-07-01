
export const typeDefs = `#graphql
  scalar Cursor

  type PageInfo {
    hasNextPage: Boolean!
  }

  type Product {
    src: String!
    title: String!
    handle: String!
    status: String!
    price: Number!
  }

  type ProductEdge {
    cursor: Cursor!
    node: Product!
  }

  type ProductConnection {
    edges: [ProductEdge!]!
    pageInfo: PageInfo!
  }

  type ProductOfStore {
    src: String!
    title: String!
    handle: String!
    status: String!
    price: Number!
    ProductConnection(first: Int!, after: Cursor): ProductConnection!
  }

  type Query {
    ProductOfStore: ProductOfStore!
  }
`;