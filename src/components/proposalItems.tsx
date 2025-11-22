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
// import { toast } from "sonner";

type ProposalType = {
  _id: string;
  workspace: string;
  employeeEmail: string;
};

export default function ProposalItems() {
  const [proposals, setProposals] = useState<ProposalType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/proposals");

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
    <>
      {!proposals.length && (
        <p className="text-center py-42">No proposals yet.</p>
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
          {proposals.map((prop) => (
            <TableRow>
              <TableCell className="font-medium">{prop.workspace}</TableCell>
              <TableCell>{prop.employeeEmail}</TableCell>
              <TableCell>2</TableCell>
              <TableCell className="text-right">fff</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
