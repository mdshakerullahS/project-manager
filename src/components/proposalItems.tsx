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

type ProposalType = {
  _id: string;
  workspace: UserType;
  employeeEmail: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProposalItems() {
  const [proposals, setProposals] = useState<ProposalType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/employees/proposals");

      if (!res.ok) throw new Error("Error fetching proposals");

      const data = await res.json();

      setProposals(data.proposals || []);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  if (loading) {
    return <p className="text-center pt-24">Loading...</p>;
  }
  return (
    <Table>
      <TableCaption>{!proposals.length && "No proposals yet."}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Workspace</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proposals.map((prop) => (
          <TableRow>
            <TableCell>{prop.workspace.name}</TableCell>
            <TableCell>Frontend Developer</TableCell>
            <TableCell>{prop.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
