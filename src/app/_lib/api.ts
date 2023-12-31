import { TodoType } from "./types";

// Todoを取得する関数
export const getAllTodos = async (): Promise<TodoType[]> => {
  const res = await fetch("http://localhost:3001/tasks", { cache: "no-store" });
  const todos = res.json();

  return todos;
};

// Todoを追加する関数
export const addTodo = async (todo: TodoType): Promise<TodoType> => {
  const res = await fetch("http://localhost:3001/tasks", {
    // POSTメソッドで送信する
    method: "POST",
    headers: {
      //JSON 形式のデータを送るので、Content-Type に application/json を指定
      "Content-Type": "application/json",
    },
    //送信する JSON データをシリアライズ（JSON 文字列に変換）してリクエストボディに指定
    body: JSON.stringify(todo),
  });
  const newTodo = res.json();

  return newTodo;
};

// Todoを編集する関数
export const editTodo = async (
  id: string,
  newText: string
): Promise<TodoType> => {
  const res = await fetch(`http://localhost:3001/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: newText }),
  });
  const updatedTodo = res.json();

  return updatedTodo;
};

// Todoを削除する関数
export const deleteToto = async (id: string): Promise<TodoType> => {
  const res = await fetch(`http://localhost:3001/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  });
  const deletedTodo = res.json();

  return deletedTodo;
}