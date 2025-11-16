"use client";

import { usePathname } from "next/navigation";
import ProjectForm from "./projectForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { SidebarTrigger } from "./ui/sidebar";
import TeamForm from "./teamForm";
import TaskForm from "./taskForm";
import EmployeeForm from "./employeeForm";

export default function Header() {
  const pathname = usePathname();

  const getText = (x: typeof pathname) => {
    switch (x) {
      case "/dashboard/my-tasks":
        return "Task";
      case "/dashboard/teams":
        return "Team";
      case "/dashboard/employees":
        return "Employee";
      default:
        return "Project";
    }
  };

  const getForm = (x: typeof pathname) => {
    switch (x) {
      case "/dashboard/my-tasks":
        return <TaskForm />;
      case "/dashboard/teams":
        return <TeamForm />;
      case "/dashboard/employees":
        return <EmployeeForm />;
      default:
        return <ProjectForm />;
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-3 py-2 border-b border-border">
      <SidebarTrigger />

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            {pathname === "/dashboard/employees" ? "Add" : "Create"}{" "}
            {getText(pathname)}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pathname === "/dashboard/employees" ? "Add" : "Create"} New{" "}
              {getText(pathname)}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription />
          {getForm(pathname)}
        </DialogContent>
      </Dialog>
    </header>
  );
}
