import { gql } from "@/app/lib/gql";

export const getTodosQuery = gql(`
  query Todos {
    todos {
      id
      title
      done
      createdAt
    }
  }
`);
