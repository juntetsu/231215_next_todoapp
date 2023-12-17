"use client";

import { editTodo } from "@/app/_lib/api";
import { TodoType } from "@/app/_lib/types";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface TodoProps {
  todo: TodoType;
}

const Todo = ({ todo }: TodoProps) => {
  // refを使って、input要素にフォーカスを当てる
  const ref = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState(todo.text);

  // 発火タイミングは、isEditingの値が変わった時
  // currentがnullの場合があるので、?でnullチェック
  useEffect(() => {
    if (isEditing) {
      ref.current?.focus()
    }
  }, [isEditing])

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handelSave = async () => {
    await editTodo(todo.id, editedTodo)
    setIsEditing(false);
  };

  return (
    <li className="flex justify-between p-4 bg-white border-l-4 border-blue-500 rounded shadow">
      {isEditing ? (
        // ref属性にrefを指定
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
          <button className="text-blue-500 mr-5" onClick={handelSave}>
            Save
          </button>
        ) : (
          <button className="text-green-500 mr-5" onClick={handleEdit}>
            Edit
          </button>
        )}
        <button className="text-red-500">Delete</button>
      </div>
    </li>
  );
};

export default Todo;
