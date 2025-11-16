"use client";

import { useState } from "react";
import Filters from "./filters";
import ProjectItems from "./projectItems";
import { useProjects } from "../app/context/ProjectContext";

export default function Projects() {
  const { projects } = useProjects();

  const [filterValue, setFilterValue] = useState<string>("All");

  const filteredProjects = projects.filter((project) => {
    if (filterValue === "All") return true;
    return project.status === filterValue;
  });

  return (
    <div className="flex flex-col gap-2">
      <Filters filterValue={filterValue} setFilterValue={setFilterValue} />
      <ProjectItems filteredProjects={filteredProjects} />
    </div>
  );
}
