"use client";

import { ProjectType } from "@/src/components/projects";
import { TaskType } from "@/src/components/taskItems";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/src/components/ui/item";
import { MoreHorizontalIcon, PenBox, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function Page({ params }: PageProps) {
  const { id } = use(params);
  const [loading, setLoading] = useState<boolean>(false);
  const [project, setProject] = useState<ProjectType | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user.accountType !== "Workspace") {
      router.push("/dashboard");
    }
  }, []);

  useEffect(() => {
    const getProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const result = await res.json();

        setProject(result.fullProject);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load task");
      }
    };

    getProject();
  }, [id]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete subtask");

      const data: any = await res.json();

      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>{project?.title}</CardTitle>
          <CardDescription>{project?.description}</CardDescription>
        </div>
        <CardDescription>
          Complete Before -{" "}
          {project?.deadline
            ? new Date(project.deadline).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "No deadline"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {project?.tasks.map((task: TaskType) => (
          <Item key={task._id} variant="outline" className="cursor-pointer">
            <ItemContent>
              <ItemTitle>{task.title}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    aria-label="Open menu"
                    size="icon-sm"
                  >
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Trash />
                      Assign Task
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PenBox />
                      Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDelete(task._id)}>
                      <Trash />
                      Delete Task
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemActions>
          </Item>
        ))}
      </CardContent>
    </Card>
  );
}
