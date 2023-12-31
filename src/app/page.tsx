import AddTask from "@/app/_components/AddTask";
import TodoList from "@/app/_components/TodoList";
import { getAllTodos } from "@/app/_lib/api";
import Image from "next/image";

export default async function Home() {
  const todos = await getAllTodos();
  console.log(todos)
  
  return (
    <main className="flex flex-col justify-center items-center min-h-screen py-2 bg-gray-200">
      <h1 className="text-4xl font-bold text-gray-700">Next13 Todo App</h1>
      <div className="w-full max-w-xl mt-5">
        <div className="w-full px-8 py-6 bg-white shadow-md rounded-lg">
          <AddTask />
          <TodoList todos={todos} />
        </div>
      </div>
    </main>
  );
}
