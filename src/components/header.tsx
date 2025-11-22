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
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useMemo } from "react";

const FORMS: Record<string, any> = {
  "/dashboard/my-tasks": TaskForm,
  "/dashboard/teams": TeamForm,
  "/dashboard/employees": EmployeeForm,
  "/dashboard": ProjectForm,
};

const TEXTS: Record<string, string> = {
  "/dashboard/my-tasks": "Task",
  "/dashboard/teams": "Team",
  "/dashboard/employees": "Employee",
  "/dashboard": "Project",
};

export default function Header() {
  const { data: session } = useSession();

  const pathname = usePathname();

  const CreateText = useMemo(() => {
    if (session?.user.accountType === "Individual") return "Task";

    return TEXTS[pathname] ?? "Project";
  }, [pathname, session]);

  const FormComponent = useMemo(() => {
    if (!session) return () => <p>Loading...</p>;

    if (session?.user.accountType === "Individual") return TaskForm;

    return FORMS[pathname] ?? ProjectForm;
  }, [pathname, session]);

  if (!session) {
    return (
      <header className="w-full flex items-center justify-between px-3 py-2 border-b border-border">
        <SidebarTrigger />
        <Button disabled>Loading...</Button>
      </header>
    );
  }

  return (
    <header className="w-full flex items-center justify-between px-3 py-2 border-b border-border">
      <SidebarTrigger />

      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button>
            {pathname === "/dashboard/employees" ? "Add" : "Create"}{" "}
            {CreateText}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pathname === "/dashboard/employees" ? "Add" : "Create"} New{" "}
              {CreateText}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription />
          <FormComponent />
        </DialogContent>
      </Dialog>
    </header>
  );
}
