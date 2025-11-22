"use client";

import { useState } from "react";
import TeamEmployeeFilter from "./teamEmployeeFilter";
import TeamItems from "./teamItems";

export default function Teams() {
  const [filterValue, setFilterValue] = useState<string>("All");

  return (
    <div className="flex flex-col gap-2">
      <TeamEmployeeFilter
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      <TeamItems />
    </div>
  );
}
