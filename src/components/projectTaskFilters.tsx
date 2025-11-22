import React, { SetStateAction } from "react";
import { Button } from "./ui/button";

export type FilterProps = {
  filterValue: string;
  setFilterValue: React.Dispatch<SetStateAction<string>>;
};

export default function ProjectTaskFilter({
  filterValue,
  setFilterValue,
}: FilterProps) {
  const filters = ["All", "To Do", "In Progress", "Completed"];

  return (
    <div className="flex items-center py-2">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={`${filterValue === filter ? "outline" : "ghost"}`}
          onClick={() => setFilterValue(filter)}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}
