"use client";

import { useState } from "react";
import TeamEmployeeFilter from "./teamEmployeeFilter";
import EmployeeItems from "./employeeItems";

export default function Employees() {
  const [filterValue, setFilterValue] = useState<string>("All");

  return (
    <div className="flex flex-col gap-2">
      <TeamEmployeeFilter
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      <EmployeeItems />
    </div>
  );
}
