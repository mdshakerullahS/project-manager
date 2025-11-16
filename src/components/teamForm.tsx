import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import Select from "react-select";

interface IFormInput {
  name: string;
  operator: string;
  members: string[];
}

const employees = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export default function TeamForm() {
  const { register, watch, handleSubmit, control, reset } = useForm<IFormInput>(
    {
      defaultValues: {
        name: "",
        operator: "",
        members: [],
      },
    }
  );

  const name = watch("name");
  const operator = watch("operator");
  const members = watch("members");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create team");
      }

      const result = await res.json();

      toast.success(result.message);

      reset();
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-2 space-y-6">
      <div className="space-y-2">
        <Label>Team Name</Label>
        <Input type="text" {...register("name")} />
      </div>

      <div className="w-full flex flex-col gap-3">
        <Label className="px-1">Select Operator to</Label>
        <Controller
          name="operator"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              options={employees}
              value={
                employees.find((employee) => employee.value === value) || null
              }
              onChange={(selectedOption) =>
                onChange(selectedOption ? selectedOption.value : "")
              }
              placeholder="Select Operator..."
              isClearable
            />
          )}
        />
      </div>

      <div className="w-full flex flex-col gap-3">
        <Label className="px-1">Select Members</Label>
        <Controller
          name="members"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              isMulti
              options={employees}
              value={employees.filter((employee) =>
                (value || []).includes(employee.value)
              )}
              onChange={(members) => {
                onChange(members ? members.map((option) => option.value) : []);
              }}
              placeholder="Select Members..."
            />
          )}
        />
      </div>

      <div className="flex items-center justify-center p-4">
        <Button type="submit" disabled={!name || !operator || !members.length}>
          Create Team
        </Button>
      </div>
    </form>
  );
}
