import { z } from "zod";
import "./App.css";
import { useSearchParams } from "react-router-dom";
import { useTodos } from "./useTodos";

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
  const { data: todos = [], isLoading } = useTodos();
  const [filter, setFilter] = useFilterSearchParams();

  // Derived state
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(filter.toLowerCase())
  );

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
        {isLoading ? <p>Loading...</p> : null}
        {filteredTodos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </form>
    </>
  );
}

export default App;
