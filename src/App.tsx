import { z } from "zod";
import "./App.css";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

type Todo = z.infer<typeof todoSchema>;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function getTodos() {
      try {
        const resp = await fetch("http://localhost:3001/tods");
        const data = todoSchema.array().parse(await resp.json());
        setTodos(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }
    getTodos();
  }, []);

  // Derived state
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (error) throw error;

  return (
    <>
      <form>
        <input
          type="text"
          placeholder="Filter todos"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
        {loading && <p>Loading...</p>}
        {filteredTodos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </form>
    </>
  );
}

export default App;
