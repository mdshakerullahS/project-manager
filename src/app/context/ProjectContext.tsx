"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { TaskType } from "./TaskContext";

export type ProjectType = {
  _id: string;
  userID: string;
  title: string;
  description: string;
  tasks: TaskType[];
  deadline: string;
  status: "To Do" | "In Progress" | "Completed";
};

type ProjectsContextType = {
  loading: boolean;
  projects: ProjectType[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  getProjects: () => Promise<void>;
};

type ProjectsProviderProps = {
  children: ReactNode;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export function ProjectsProvider({ children }: ProjectsProviderProps) {
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

      setProjects(data.projects);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        loading,
        projects,
        setLoading,
        setProjects,
        getProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const projectsContext = useContext(ProjectsContext);
  if (!projectsContext) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return projectsContext;
}
