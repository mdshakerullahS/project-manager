"use client";

import { useEffect, useState } from "react";
// import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type WorkspaceType = {
  _id: string;
  account: string;
  employees: string[];
};
export default function WorkspaceItems() {
  const [Workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getWorkspaces = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/workspaces");

      if (!res.ok) throw new Error("Error fetching workspaces");

      const data = await res.json();

      setWorkspaces(data.workspaces || []);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkspaces();
  }, []);

  if (loading) {
    return <p className="text-center pt-24">Loading...</p>;
  }

  return (
    <>
      {!Workspaces.length && (
        <p className="text-center py-42">No Workspaces yet.</p>
      )}

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Workspace</TableHead>
            <TableHead>My Role</TableHead>
            <TableHead>Tasks in Progress</TableHead>
            <TableHead className="text-right">Join Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Workspaces.map((ws) => (
            <TableRow>
              <TableCell className="font-medium">{ws.account}</TableCell>
              <TableCell>{ws.employees}</TableCell>
              <TableCell>2</TableCell>
              <TableCell className="text-right">fff</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
