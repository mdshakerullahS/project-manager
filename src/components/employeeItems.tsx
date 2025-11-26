"use client";

import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import useEmployees from "../stores/employeeStore";

export default function EmployeeItems() {
  const { loading, employees, getEmployees } = useEmployees();

  useEffect(() => {
    getEmployees();
  }, []);

  if (loading) {
    return <p className="text-center pt-24">Loading...</p>;
  }

  return (
    <>
      <Table>
        <TableCaption>
          {!employees.length &&
            'No employee yet - Click "Add Employee" to send proposal.'}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Tasks in Progress</TableHead>
            <TableHead>Join Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow>
              <TableCell>{employee.name}</TableCell>
              <TableCell>Frontend Developer</TableCell>
              <TableCell>{employee.taskCount}</TableCell>
              <TableCell>null</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
