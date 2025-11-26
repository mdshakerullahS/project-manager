import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface IFormInput {
  email: string;
}

export default function EmployeeForm() {
  const { register, watch, handleSubmit, reset } = useForm<IFormInput>({
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const res = await fetch("/api/employee/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send proposal");
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
        <Label>Employee's Email</Label>
        <Input type="text" {...register("email")} />
      </div>

      <div className="flex items-center justify-center p-4">
        <Button type="submit" disabled={!email}>
          Request Employee
        </Button>
      </div>
    </form>
  );
}
