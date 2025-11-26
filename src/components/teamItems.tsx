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
import useTeams from "../stores/teamStore";

export default function TeamItems() {
  const { loading, teams, getTeams } = useTeams();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  useEffect(() => {
    getTeams();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/teams/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete team");

      const data: any = await res.json();

      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <p className="text-center pt-24">Loading...</p>;
  }

  return (
    <>
      {!teams.length && (
        <p className="text-center py-42">
          No teams yet- Click "Create Team" to create one.{" "}
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

              <TeamForm id={team._id} />
            </DialogContent>
          </Dialog>
        </Item>
      ))}
    </>
  );
}
