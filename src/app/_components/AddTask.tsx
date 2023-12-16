'use client'

import { addTodo } from "@/app/_lib/api";
import React, { ChangeEvent, FormEvent, useState } from "react";
import {v4 as uuidv4} from 'uuid'

const AddTask = () => {
  const [todoTitle, setTodoTitle] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    // Prevent the default behaviour of the form
    e.preventDefault;
    // Add the todo
    await addTodo({ id: uuidv4(), text: todoTitle });
    // Reset the input field
    setTodoTitle("");
  };

  return (
    <form className="mb-4 space-y-3">
      <input
        type="text"
        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:border-blue-400"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTodoTitle(e.target.value)}
      />
      <button
        className="w-full px-4 py-2 text-white bg-blue-500 rounded transform transition-transform duration-200 hover:bg-blue-400 hover:scale-95"
        onClick={handleSubmit}
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTask;
