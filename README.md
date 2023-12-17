---
tags:
  - README.md
  - Memo
---

- [JSON Server](#json-server)
    - [インストール](#インストール)
    - [json ファイル作成](#json-ファイル作成)
    - [JSON Server 起動](#json-server-起動)
    - [API 作成](#api-作成)
    - [SSR, SSG, CSR のパターン](#ssr-ssg-csr-のパターン)
    - [API 呼び出し](#api-呼び出し)
    - [タスクを追加する API](#タスクを追加する-api)
      - [API の作成](#api-の作成)
      - [API の呼び出し](#api-の呼び出し)
    - [タスクを編集する API](#タスクを編集する-api)
      - [API 作成](#api-作成-1)
      - [API 呼び出し](#api-呼び出し-1)
    - [タスクを削除する API](#タスクを削除する-api)
      - [API 作成](#api-作成-2)
      - [API 呼び出し](#api-呼び出し-2)

# JSON Server

### インストール

モックデータとかテストで API 作りたい時は、**JSONserver**で  
(本番時は Firebase とか Supabase とか)  
`npm install json-server`

### json ファイル作成

data/todos.json

```json
{
  "tasks": [
    {
      "id": "1",
      "text": "ジム"
    },
    {
      "id": "2",
      "text": "勉強"
    },
    {
      "id": "3",
      "text": "買い物"
    }
  ]
}
```

### JSON Server 起動

package.json の"scripts"に"json-server"追加

package.json

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "json-server": "json-server --watch src/app/data/todos.json --port 3001"
},
```

`npm run json-server`

`src/app/data/todos.json`を`--watch`（常に監視）し、3002 番ポートにアクセスすることで json データにアクセスできる。  
※起動したままにしておかないと、更新しても反映されない。

### API 作成

取得する API を作成  
<small>`lib/api.ts`</small>

```typescript
import { TodoType } from "./types";

export const getAllTodos = async (): Promise<TodoType[]> => {
  const res = await fetch("http://localhost:3001/tasks");
  const todos = res.json();

  return todos;
};
```

型定義ファイルも作成しておく  
<small>`lib/types.ts`</small>

```typescript
export interface TodoType {
  id: string;
  text: string;
}
```

### SSR, SSG, CSR のパターン

**SSR** にしたい場合  
頻繁に更新されるもの  
`{cache: "no-store"}`

```typescript
import { TodoType } from "./types";

export const getAllTodos = async (): Promise<TodoType[]> => {
  const res = await fetch("http://localhost:3001/tasks", { cache: "no-store" });
  const todos = res.json();

  return todos;
};
```

**SSG** にしたい場合  
例えば、ドキュメントや更新頻度の低いブログなど  
`{cache: "force-cache"}`

```typescript
import { TodoType } from "./types";

export const getAllTodos = async (): Promise<TodoType[]> => {
  const res = await fetch("http://localhost:3001/tasks", {
    cache: "force-cache",
  });
  const todos = res.json();

  return todos;
};
```

**CSR**（クライアントサイドレンダリング） にしたい場合  
`useEffect`を使う

### API 呼び出し

前提として`console.log(todos)`してもクライアントには表示されず、ターミナルに出力される。  
（サーバーサイドレンダリングなので）  
<small>`app/page.tsx`</small>

```typescript
import AddTask from "@/app/_components/AddTask";
import TodoList from "@/app/_components/TodoList";
import { getAllTodos } from "@/app/_lib/api";

export default async function Home() {
  const todos = await getAllTodos();
  console.log(todos);

  return (
    ...
  );
}
```

[
{ id: '1', text: 'ジム' },
{ id: '2', text: '勉強' },
{ id: '3', text: '買い物' }
]

今回は Home で呼び出して、TodoList コンポーネントに props で渡す。  
<small>`app/page.tsx`</small>

```typescript
import AddTask from "@/app/_components/AddTask";
import TodoList from "@/app/_components/TodoList";
import { getAllTodos } from "@/app/_lib/api";

export default async function Home() {
  const todos = await getAllTodos();

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
```

<small>`components/TodoList.tsx`</small>

```typescript
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
```

表示部分は Todo コンポーネントに分ける。  
<small>`Todo.tsx`</small>

```typescript
import { TodoType } from "@/app/_lib/types";
import React from "react";

interface TodoProps {
  todo: TodoType;
}

const Todo = ({ todo }: TodoProps) => {
  return (
    <li className="flex justify-between p-4 bg-white border-l-4 border-blue-500 rounded shadow">
      <span>{todo.text}</span>
      <div>
        <button className="text-green-500 mr-5">Edit</button>
        <button className="text-red-500">Delete</button>
      </div>
    </li>
  );
};

export default Todo;
```

### タスクを追加する API

#### API の作成

<small>`lib/api.ts`</small>

```typescript
// Todoを追加する関数
export const addTodo = async (todo: TodoType): Promise<TodoType> => {
  const res = await fetch("http://localhost:3001/tasks", {
    // POSTメソッドで送信する
    method: "POST",
    //JSON 形式のデータを送るので、Content-Type に application/json を指定
    headers: {
      "Content-Type": "application/json",
    },
    //送信する JSON データをシリアライズ（JSON 文字列に変換）してリクエストボディに指定
    body: JSON.stringify(todo),
  });
  const newTodo = res.json();

  return newTodo;
};
```

**HTTP メソッド**には基本的に 4 種類存在し、CRUD に以下のように対応している。

- Create（作成）：POST/PUT
- Read（読み込み）：GET
- Update（更新）：PUT
- Delete（削除）：DELETE

**HTTP ヘッダーについて**  
Content-Type はリクエストボディのメディアタイプを指定する役割を持つ  
`application/json`：JSON ファイル

#### API の呼び出し

Add Task ボタンがクリックされたタイミングで呼び出す。

その前に、id にはランダムな値を設定したいので、uuid をインストール  
`npm i uuid`

TS 使ってるので、型定義用のファイルもインストール  
`npm i --save-dev @types/uuid`

<small>`components/AddTask.tsx`</small>

```typescript
"use client"; // useStateはクライアントサイドでしか使えないので

import { addTodo } from "@/app/_lib/api";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // uuidインポート

const AddTask = () => {
  const [todoTitle, setTodoTitle] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    // Prevent the default behaviour of the form
    e.preventDefault;
    // Add the todo
    await addTodo({ id: uuidv4(), text: todoTitle }); // uuid定義
    // Reset the input field
    setTodoTitle("");
  };

  return (
    <form className="mb-4 space-y-3">
      <input
        type="text"
        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:border-blue-400"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTodoTitle(e.target.value)
        }
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
```

### タスクを編集する API

#### API 作成

<small>`lib/api.ts`</small>

```typescript
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
```

id と newText を渡して、それをもとに更新する処理を記述する。

#### API 呼び出し

edit ボタンを押したら編集モードになるように。  
また、編集モードの時は save ボタンにする。  
<small>`conponents/Todo.tsx`</small>

```typescript
"use client";

import { editTodo } from "@/app/_lib/api";
import { TodoType } from "@/app/_lib/types";
import React, { useState } from "react";

interface TodoProps {
  todo: TodoType;
}

const Todo = ({ todo }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handelSave = async () => {
    setIsEditing(false);
  };

  return (
    <li className="flex justify-between p-4 bg-white border-l-4 border-blue-500 rounded shadow">
      {isEditing ? (
        <input type="text" className="mr-2 py-1 px-2 border-gray-400 border" />
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
```

このままだと input 内の編集が出来ないし、save ボタンを押しても更新されないので以下のように記述。

```typescript
"use client";

import { editTodo } from "@/app/_lib/api";
import { TodoType } from "@/app/_lib/types";
import React, { ChangeEvent, useState } from "react";

interface TodoProps {
  todo: TodoType;
}

const Todo = ({ todo }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handelSave = async () => {
    await editTodo(todo.id, editedTodo);
    setIsEditing(false);
  };

  return (
    <li className="flex justify-between p-4 bg-white border-l-4 border-blue-500 rounded shadow">
      {isEditing ? (
        <input
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
```

1. useState で editedTodo の状態を保持
2. input の value と onChange イベントを記述
3. handleSave をクリックしたら更新用 API（editTodo）を呼び出す

おまけ  
edit ボタンを押した時、デフォルトで input にフォーカスが当たってる状態にしたいので useRef と useEffect を使って DOM 操作  
（詳しくはコード内のコメント参照）

```typescript
"use client";

import { editTodo } from "@/app/_lib/api";
import { TodoType } from "@/app/_lib/types";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface TodoProps {
  todo: TodoType;
}

const Todo = ({ todo }: TodoProps) => {
  // refを使って、input要素にフォーカスを当てる
  const ref = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState(todo.text);

  // 発火タイミングは、isEditingの値が変わった時
  // currentがnullの場合があるので、?でnullチェック
  useEffect(() => {
    if (isEditing) {
      ref.current?.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handelSave = async () => {
    await editTodo(todo.id, editedTodo);
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
```

### タスクを削除する API

#### API 作成

```typescript
// Todoを削除する関数
export const deleteToto = async (id: string): Promise<TodoType> => {
  const res = await fetch(`http://localhost:3001/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const deletedTodo = res.json();

  return deletedTodo;
};
```

#### API 呼び出し

```typescript
"use client";

import { deleteToto, editTodo } from "@/app/_lib/api";
import { TodoType } from "@/app/_lib/types";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface TodoProps {
  todo: TodoType;
}

const Todo = ({ todo }: TodoProps) => {
 ...

  // Delete Todo
  const handleDelete = async () => {
    await deleteToto(todo.id);
  };

  return (
    <li className="flex justify-between p-4 bg-white border-l-4 border-blue-500 rounded shadow">
      ...
      <div>
        ...
        <button className="text-red-500" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default Todo;
```
