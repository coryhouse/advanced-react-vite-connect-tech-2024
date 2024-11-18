import { set, z } from "zod";
import "./App.css";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const todos = ["Learn React", "Learn Vite"];

function useFilterSearchParams() {
  const [params, setParams] = useSearchParams();
  return [
    z.string().parse(params.get("filter") || ""),
    (filter: string) => {
      setParams({ filter });
    },
  ] as const;
}

function App() {
  const [filter, setFilter] = useFilterSearchParams();
  const [todos, setTodos] = useState<string[]>([]);

  useEffect(() => {
    async function getTodos() {
      const resp = await fetch("http://localhost:3001/todos");
      const data = await resp.json();
      setTodos(data);
    }
    getTodos();
  });

  // Derived state
  const filteredTodos = todos.filter((todo) =>
    todo.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <form>
        <input
          type="text"
          placeholder="Filter todos"
          value={filter}
          onChange={(e) => {
            setParams({ filter: e.target.value });
          }}
        />
        {filteredTodos.map((todo) => (
          <li>{todo}</li>
        ))}
      </form>
    </>
  );
}

export default App;
