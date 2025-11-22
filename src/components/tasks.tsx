"use client";

import { useEffect, useState } from "react";
import TaskItems, { TaskType } from "./taskItems";
import ProjectTaskFilter from "./projectTaskFilters";

export default function Tasks() {
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

      setTasks(data.tasks || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTasks();
  }, []);

  const [filterValue, setFilterValue] = useState<string>("All");

  const filteredTasks = tasks.filter((task) => {
    if (filterValue === "All") return true;
    return task.status === filterValue;
  });

  return (
    <div className="flex flex-col gap-2">
      <ProjectTaskFilter
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      <TaskItems
        filteredTasks={filteredTasks}
        setLoading={setLoading}
        loading={loading}
      />
    </div>
  );
}
