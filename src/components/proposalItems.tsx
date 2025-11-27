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
import { Button } from "./ui/button";
import { CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

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

  const getProposals = async () => {
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
    getProposals();
  }, []);

  const handleActions = async (
    id: string,
    { accept, decline }: { accept?: boolean; decline?: boolean }
  ) => {
    try {
      const res = await fetch(`/api/employees/proposals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          body: JSON.stringify({ accept, decline }),
        },
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proposals.map((prop) => (
          <TableRow>
            <TableCell>{prop.workspace.name}</TableCell>
            <TableCell>Frontend Developer</TableCell>
            <TableCell>{prop.createdAt}</TableCell>
            <TableCell className="space-x-2">
              <Button
                size="icon-sm"
                variant="destructive"
                onClick={() => handleActions(prop._id, { decline: true })}
              >
                <X />
              </Button>
              <Button
                size="icon-sm"
                onClick={() => handleActions(prop._id, { accept: true })}
              >
                <CheckCircle />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
