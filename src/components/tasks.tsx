"use client";

import { useState } from "react";
import Filters from "./filters";
import { useTasks } from "../app/context/TaskContext";
import TaskItems from "./taskItems";

export default function Tasks() {
  const { tasks } = useTasks();

  const [filterValue, setFilterValue] = useState<string>("All");

  const filteredTasks = tasks.filter((task) => {
    if (filterValue === "All") return true;
    return task.status === filterValue;
  });

  return (
    <div className="flex flex-col gap-2">
      <Filters filterValue={filterValue} setFilterValue={setFilterValue} />
      <TaskItems filteredTasks={filteredTasks} />
    </div>
  );
}
