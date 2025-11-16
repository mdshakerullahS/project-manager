"use client";

import { useEffect, useState } from "react";
import { MoreHorizontalIcon, PenBox, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Item, ItemActions, ItemContent, ItemTitle } from "./ui/item";
import { useProjects } from "../app/context/ProjectContext";
import { toast } from "sonner";

type UserType = {
  _id: string;
  name: string;
};

export default function EmployeeItems() {
  const { getProjects, loading, setLoading } = useProjects();
  const [employees, setEmployees] = useState<UserType[] | []>([]);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await fetch("/api/employees");

        if (!res.ok) throw new Error("Error fetching employees");

        const data = await res.json();

        setEmployees(data.employees || []);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    getEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete project");

      const data: any = await res.json();

      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center pt-24">Loading...</p>;
  }

  return (
    <>
      {(!employees || !employees.length) && (
        <p className="text-center py-42">
          No employee yet - Click "Add Employee" to make request.
        </p>
      )}

      {employees.map((employee) => (
        <Item key={employee._id} variant="outline">
          <ItemContent>
            <ItemTitle>{employee.name}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" aria-label="Open menu" size="icon-sm">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <DropdownMenuItem className="p-0">
                      <PenBox />
                      Edit Project
                    </DropdownMenuItem>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleDelete(employee._id)}>
                    <Trash />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
        </Item>
      ))}
    </>
  );
}
