"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TaskType } from "./taskItems";
import { toast } from "sonner";
import { Types } from "mongoose";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type TaskFormProps = {
  id?: string;
};

interface IFormInput {
  creator: Types.ObjectId;
  title: string;
  status: "To Do" | "In Progress" | "Completed";
  project?: Types.ObjectId;
  assignedTo: Types.ObjectId;
}

export default function TaskForm({ id }: TaskFormProps) {
  const [task, setTask] = useState<TaskType | null>(null);

  useEffect(() => {
    if (id) {
      const getTask = async () => {
        try {
          const res = await fetch(`/api/my-tasks/${id}`, {
            method: "GET",
            credentials: "include",
          });
          const result = await res.json();

          setTask(result.task);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load task");
        }
      };

      getTask();
    }
  }, []);

  const { register, watch, handleSubmit, reset } = useForm<IFormInput>({
    defaultValues: {
      title: task ? task.title : "",
      status: task ? task.status : "To Do",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        status: task.status || "To Do",
      });
    }
  }, [task, reset]);

  const title = watch("title");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const method = task ? "PUT" : "POST";
      const url = task ? `/api/my-tasks/${task._id}` : `/api/my-tasks`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save task");

      const result = await res.json();
      toast.success(result.message || "Task saved successfully");

      reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-2 space-y-6">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input type="text" {...register("title", { required: true })} />
      </div>

      <div className="flex items-center justify-center p-4">
        <Button type="submit" disabled={title === "" || title === task?.title}>
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
