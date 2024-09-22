import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const typeDefs = `#graphql
  type Todo {
    id: Int!
    title: String!
    done: Boolean!
    createdAt: String!
  }

  type Query {
    todos: [Todo!]!
  }

  type Mutation {
    createTodo(title: String!): Todo!
    updateTodo(id: Int!, done: Boolean!): Todo!
    deleteTodo(id: Int!): Todo!       
    editTodo(id: Int!, title: String!): Todo!   
  }
`;


const resolvers = {
  Mutation: {
    createTodo: async (_: never, args: { title: string }) => {
      try {
        const newTodo = await prisma.todo.create({
          data: { title: args.title, done: false },
        });
        return newTodo;
      } catch (error) {
        console.error("Error creating todo:", error);
        throw new Error("Failed to create todo");
      }
    },
    updateTodo: async (_: never, args: { done: boolean; id: number }) => {
      try {
        const updatedTodo = await prisma.todo.update({
          where: { id: args.id },
          data: { done: args.done },
        });
        return updatedTodo;
      } catch (error) {
        console.error("Error updating todo:", error);
        throw new Error("Failed to update todo");
      }
    },
    deleteTodo: async (_: never, args: { id: number }) => {
      try {
        const deletedTodo = await prisma.todo.delete({
          where: { id: args.id },
        });
        return deletedTodo;
      } catch (error) {
        console.error("Error deleting todo:", error);
        throw new Error("Failed to delete todo");
      }
    },
    editTodo: async (_: never, args: { id: number; title: string }) => {
      try {
        const updatedTodo = await prisma.todo.update({
          where: { id: args.id },
          data: { title: args.title },
        });
        return updatedTodo;
      } catch (error) {
        console.error("Error editing todo:", error);
        throw new Error("Failed to edit todo");
      }
    },
  },
  Query: {
    todos: async () => {
      try {
        return await prisma.todo.findMany({
          orderBy: { id: 'asc' }  
        });
      } catch (error) {
        console.error("Error fetching todos:", error);
        throw new Error("Failed to fetch todos");
      }
    },
  },  
};



const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
