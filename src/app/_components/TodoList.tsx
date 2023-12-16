import Todo from "@/app/_components/Todo";
import { TodoType } from "@/app/_lib/types";
import React from "react";

interface TodoListProps {
  todos: TodoType[];
}

const TodoList = ({ todos }: TodoListProps) => {
  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
