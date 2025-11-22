"use client";

import { useEffect, useState } from "react";
import ProjectItems from "./projectItems";

import { TaskType } from "./taskItems";
import ProjectTaskFilter from "./projectTaskFilters";
export type ProjectType = {
  _id: string;
  userID: string;
  title: string;
  description: string;
  tasks: TaskType[];
  deadline: string;
  status: "To Do" | "In Progress" | "Completed";
};

export default function Projects() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);

  const getProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");

      if (!res.ok) {
        throw new Error("Projects couldn't be fetched");
      }
      const data = await res.json();

      setProjects(data.projects || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProjects();
  }, []);

  const [filterValue, setFilterValue] = useState<string>("All");

  const filteredProjects = projects.filter((project) => {
    return filterValue === "All" || project.status === filterValue;
  });

  return (
    <div className="flex flex-col gap-2">
      <ProjectTaskFilter
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      <ProjectItems
        filteredProjects={filteredProjects}
        setLoading={setLoading}
        loading={loading}
      />
    </div>
  );
}
