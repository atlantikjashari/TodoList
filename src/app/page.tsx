"use client";

import { AddCircle, CheckCircle, Dangerous, Delete, Edit } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  insertTodoMutation,
  updateTodoMutation,
  deleteTodoMutation,
  editTodoMutation
} from "./lib/graphql/mutation";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { getTodosQuery } from "@/app/lib/graphql/query";
import styles from "./page.module.scss";

export default function Home() {
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const { loading, error, data, refetch } = useQuery(getTodosQuery);
  const [createTodo] = useMutation(insertTodoMutation, {
    onCompleted: () => {
      setTitle("");  
      refetch();    
    }
  });
  const [updateTodo] = useMutation(updateTodoMutation, {
    onCompleted: () => refetch(),  
  });
  const [deleteTodo] = useMutation(deleteTodoMutation, {
    onCompleted: () => refetch(),  
  });
  const [editTodo] = useMutation(editTodoMutation, {
    onCompleted: () => {
      setEditId(null); 
      refetch();       
    }
  });

  const handleEdit = (todoId: number, todoTitle: string) => {
    setEditId(todoId);
    setEditTitle(todoTitle);
  };

  const handleUpdate = () => {
    if (editId && editTitle.trim() !== "") {
      editTodo({
        variables: { id: editId, title: editTitle }
      });
    }
  };

  if (error) return <Typography color="error">Error loading todos.</Typography>;

  return (
    <div className={styles.container}>
      <Paper className={styles.left}>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label={"Title"}
          fullWidth
        />
        <div>
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => {
              if (title.trim() !== "") {
                createTodo({
                  variables: { title }
                });
              }
            }}
          >
            Add
          </Button>
        </div>
      </Paper>

      <Paper className={styles.right}>
        <Typography variant="h1">My Todo App</Typography>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress />
          </div>
        ) : (
          <div>
            {data && data.todos && data.todos.length > 0 ? (
              data.todos.map((todo) => (
                <Paper elevation={2} key={todo.id} className={styles.item}>
                  <div className={styles.title}>
                    {editId === todo.id ? (
                      <>
                        <TextField
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          fullWidth
                        />
                        <Button onClick={handleUpdate}>Save</Button>
                      </>
                    ) : (
                      <>
                        <Typography>{todo.title}</Typography>
                        <div>
                          <IconButton
                            onClick={() =>
                              updateTodo({
                                variables: {
                                  updateTodoId: todo.id,
                                  done: !todo.done,
                                },
                              })
                            }
                          >
                            {todo.done ? (
                              <CheckCircle color="success" />
                            ) : (
                              <Dangerous color="warning" />
                            )}
                          </IconButton>
                          <IconButton onClick={() => handleEdit(todo.id, todo.title)}>
                            <Edit color="primary" />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              deleteTodo({
                                variables: { id: todo.id },
                              })
                            }
                          >
                            <Delete color="error" />
                          </IconButton>
                        </div>
                      </>
                    )}
                  </div>
                </Paper>
              ))
            ) : (
              <Typography>No todos available.</Typography>
            )}
          </div>
        )}
      </Paper>
    </div>
  );
}
