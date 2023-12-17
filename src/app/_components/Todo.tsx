"use client";

import { deleteToto, editTodo } from "@/app/_lib/api";
import { TodoType } from "@/app/_lib/types";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface TodoProps {
  todo: TodoType;
}

const Todo = ({ todo }: TodoProps) => {
  const ref = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState(todo.text);

  useEffect(() => {
    if (isEditing) {
      ref.current?.focus()
    }
  }, [isEditing])

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await editTodo(todo.id, editedTodo)
    setIsEditing(false);
  };
 
  // Delete Todo
  const handleDelete = async () => {
    await deleteToto(todo.id)
  }

  return (
    <li className="flex justify-between p-4 bg-white border-l-4 border-blue-500 rounded shadow">
      {isEditing ? (
        <input
          ref={ref}
          type="text"
          className="mr-2 py-1 px-2 border-gray-400 border"
          value={editedTodo}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEditedTodo(e.target.value)
          }
        />
      ) : (
        <span>{editedTodo}</span>
      )}
      <div>
        {isEditing ? (
          <button className="text-blue-500 mr-5" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="text-green-500 mr-5" onClick={handleEdit}>
            Edit
          </button>
        )}
        <button className="text-red-500" onClick={handleDelete}>Delete</button>
      </div>
    </li>
  );
};

export default Todo;
