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
import ProjectForm from "./projectForm";
import { ProjectType } from "./projects";
import { useSession } from "next-auth/react";

type ItemProps = {
  filteredProjects: ProjectType[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
};

export default function ProjectItems({
  filteredProjects,
  setLoading,
  loading,
}: ItemProps) {
  const { data: session } = useSession();

  const [openDialog, setOpenDialog] = useState<string | null>(null);

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
      {(!filteredProjects || !filteredProjects.length) && (
        <p className="text-center py-42">
          No projects yet - Click "Create Project" to create one.
        </p>
      )}

      {filteredProjects.map((project) => (
        <Item key={project._id} variant="outline">
          <ItemContent>
            <Link href={`/dashboard/projects/${project._id}`}>
              <ItemTitle>{project.title}</ItemTitle>
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
                        setOpenDialog(project._id);
                      }}
                      className="p-0"
                    >
                      <PenBox />
                      Edit Project
                    </DropdownMenuItem>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleDelete(project._id)}>
                    <Trash />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>

          <Dialog
            open={openDialog === project._id}
            onOpenChange={(open) => !open && setOpenDialog(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit project</DialogTitle>
                <DialogDescription>
                  Update your project details below.
                </DialogDescription>
              </DialogHeader>

              <ProjectForm id={project._id} />
            </DialogContent>
          </Dialog>
        </Item>
      ))}
    </>
  );
}
