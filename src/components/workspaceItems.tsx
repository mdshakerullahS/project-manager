"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { UserType } from "../stores/employeeStore";

type WorkspaceType = {
  _id: string;
  account: UserType;
  employees: string[];
  taskCount: number;
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
    <Table>
      <TableCaption>{!Workspaces.length && "No workspace yet."}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Workspace</TableHead>
          <TableHead>My Role</TableHead>
          <TableHead>Tasks in Progress</TableHead>
          <TableHead>Join Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Workspaces.map((ws) => (
          <TableRow>
            <TableCell>{ws.account.name}</TableCell>
            <TableCell>Frontend Developer</TableCell>
            <TableCell>{ws.taskCount}</TableCell>
            <TableCell>null</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
