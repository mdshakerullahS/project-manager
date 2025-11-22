import { FilterProps } from "./projectTaskFilters";
import { Button } from "./ui/button";

export default function TeamEmployeeFilter({
  filterValue,
  setFilterValue,
}: FilterProps) {
  const filters = ["All", "Available", "Busy"];

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
