import { gql } from "@apollo/client";  // Ensure you're using @apollo/client's gql

export const insertTodoMutation = gql`
  mutation Mutation($title: String!) {
    createTodo(title: $title) {
      id
      title
      done
      createdAt
    }
  }
`;

export const updateTodoMutation = gql`
  mutation UpdateTodo($updateTodoId: Int!, $done: Boolean!) {
    updateTodo(id: $updateTodoId, done: $done) {
      id
      title
      done
      createdAt
    }
  }
`;

export const deleteTodoMutation = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

export const editTodoMutation = gql`
  mutation EditTodo($id: Int!, $title: String!) {
    editTodo(id: $id, title: $title) {
      id
      title
      done
      createdAt
    }
  }
`;
