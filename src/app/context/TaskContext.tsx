"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type TaskType = {
  _id: string;
  projectID: string;
  title: string;
  status: "To Do" | "In Progress" | "Completed";
};

type TasksContextType = {
  loading: boolean;
  tasks: TaskType[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  getTasks: () => Promise<void>;
};

type DataProviderProps = {
  children: ReactNode;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: DataProviderProps) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);

  const getTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/my-tasks");

      if (!res.ok) {
        throw new Error("Tasks couldn't be fetched");
      }
      const data = await res.json();

      setTasks(data.tasks);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <TasksContext.Provider
      value={{
        loading,
        tasks,
        setLoading,
        setTasks,
        getTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const taskContext = useContext(TasksContext);
  if (!taskContext) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return taskContext;
}
