import { FilterProps } from "./projectTaskFilters";
import { Button } from "./ui/button";

export default function WorkspaceFilter({
  filterValue,
  setFilterValue,
}: FilterProps) {
  return (
    <div className="flex items-center py-2">
      {["Working", "Proposals"].map((filter) => (
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
