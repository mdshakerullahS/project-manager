"use client";

import { useState } from "react";
import WorkspaceItems from "./workspaceItems";
import WorkspaceFilter from "./workspaceFilter";
import ProposalItems from "./proposalItems";

export default function Workspaces() {
  const [filterValue, setFilterValue] = useState<string>("Workspaces");
  return (
    <div>
      <WorkspaceFilter
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      {filterValue === "Workspaces" ? <WorkspaceItems /> : <ProposalItems />}
    </div>
  );
}
