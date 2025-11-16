import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Item, ItemActions, ItemContent, ItemTitle } from "./ui/item";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontalIcon, PenBox, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import TeamForm from "./teamForm";

type TeamType = {
  _id: string;
  name: string;
  creator: string;
  operator: string;
  members: string[];
};

export default function TeamItems() {
  const [teams, setTeams] = useState<TeamType[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const res = await fetch("/api/teams");

        if (!res.ok) throw new Error("Error fetching teams");

        const data = await res.json();

        setTeams(data.teams || []);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    getTeams();
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
      {(!teams || !teams.length) && (
        <p className="text-center py-42">
          No projects yet - Click "Create Project" to create one.
        </p>
      )}

      {teams.map((team) => (
        <Item key={team._id} variant="outline">
          <ItemContent>
            <Link
              href={`/dashboard/teams/${team.name
                .toLowerCase()
                .replaceAll(" ", "-")}`}
            >
              <ItemTitle>{team.name}</ItemTitle>
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
                        setOpenDialog(team._id);
                      }}
                      className="p-0"
                    >
                      <PenBox />
                      Edit Project
                    </DropdownMenuItem>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleDelete(team._id)}>
                    <Trash />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>

          <Dialog
            open={openDialog === team._id}
            onOpenChange={(open) => !open && setOpenDialog(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit project</DialogTitle>
                <DialogDescription>
                  Update your project details below.
                </DialogDescription>
              </DialogHeader>

              {/* <TeamForm id={team._id} /> */}
            </DialogContent>
          </Dialog>
        </Item>
      ))}
    </>
  );
}
