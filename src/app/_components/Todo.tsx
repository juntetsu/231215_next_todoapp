import { TodoType } from "@/app/_lib/types";
import React from "react";

interface TodoProps {
  todo: TodoType;
}

const Todo = ({ todo }: TodoProps) => {
  return (
    <li
      className="flex justify-between p-4 bg-white border-l-4 border-blue-500 rounded shadow"
    >
      <span>{todo.text}</span>
      <div>
        <button className="text-green-500 mr-5">Edit</button>
        <button className="text-red-500">Delete</button>
      </div>
    </li>
  );
};

export default Todo;
