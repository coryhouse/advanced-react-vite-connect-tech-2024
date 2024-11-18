import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

type Todo = z.infer<typeof todoSchema>;

export function useTodos() {
  return useQuery({
    queryFn: async () => {
      const resp = await fetch("http://localhost:3001/todos");
      return todoSchema.array().parse(await resp.json());
    },
    queryKey: ["todos"],
  });
}
