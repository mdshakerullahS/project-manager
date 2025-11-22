"use client";

import { Dispatch, SetStateAction, useState } from "react";
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
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import TaskForm from "./taskForm";

export type TaskType = {
  _id: string;
  projectID: string;
  title: string;
  status: "To Do" | "In Progress" | "Completed";
};
type ItemProps = {
  filteredTasks: TaskType[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
};

export default function TaskItems({
  filteredTasks,
  setLoading,
  loading,
}: ItemProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/my-tasks/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete task");

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
      {(!filteredTasks || !filteredTasks.length) && (
        <p className="text-center py-42">
          No tasks yet - Click "Create Task" to create one.
        </p>
      )}

      {filteredTasks.map((task) => (
        <Item key={task._id} variant="outline">
          <ItemContent>
            <Link
              href={`/dashboard/tasks/${task.title
                .toLowerCase()
                .replaceAll(" ", "-")}`}
            >
              <ItemTitle>{task.title}</ItemTitle>
            </Link>
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
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setOpenDialog(task._id);
                      }}
                      className="p-0"
                    >
                      <PenBox />
                      Edit Task
                    </DropdownMenuItem>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleDelete(task._id)}>
                    <Trash />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>

          <Dialog
            open={openDialog === task._id}
            onOpenChange={(open) => !open && setOpenDialog(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit task</DialogTitle>
                <DialogDescription>
                  Update your project details below.
                </DialogDescription>
              </DialogHeader>

              <TaskForm id={task._id} />
            </DialogContent>
          </Dialog>
        </Item>
      ))}
    </>
  );
}
