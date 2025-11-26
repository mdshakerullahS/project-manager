"use client";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import Select from "react-select";
import { DatePicker } from "./datePicker";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { ProjectType } from "./projects";
import useTeams from "../stores/teamStore";

type ProjectFormProps = {
  id?: string;
};

interface IFormInput {
  title: string;
  description: string;
  tasks: { title: string }[];
  deadline: Date | null;
  assignedTo: string;
  status: "To Do" | "In Progress" | "Completed";
}

export default function ProjectForm({ id }: ProjectFormProps) {
  const { teams, getTeams } = useTeams();

  useEffect(() => {
    getTeams();
  }, []);

  const [project, setProject] = useState<ProjectType | null>(null);
  useEffect(() => {
    if (id) {
      const getProject = async () => {
        try {
          const res = await fetch(`/api/projects/${id}`, {
            method: "GET",
            credentials: "include",
          });
          const result = await res.json();

          setProject(result.fullProject);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load task");
        }
      };

      getProject();
    }
  }, []);

  const { register, watch, handleSubmit, control, reset } = useForm<IFormInput>(
    {
      defaultValues: {
        title: "",
        description: "",
        tasks: [],
        deadline: null,
        assignedTo: "",
        status: "To Do",
      },
    }
  );

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "tasks",
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        tasks: project.tasks?.map((t) => ({ title: t.title })) || [],
        deadline: project.deadline ? new Date(project.deadline) : null,
        assignedTo: "",
        status: project.status || "To Do",
      });
      replace(project.tasks?.map((t) => ({ title: t.title })) || []);
    }
  }, [project, reset, replace]);

  const title = watch("title");
  const tasks = watch("tasks");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const method = project ? "PUT" : "POST";
      const url = project ? `/api/projects/${project._id}` : `/api/projects`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save project");

      const result = await res.json();
      toast.success(result.message || "Project saved successfully");

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

      <div className="space-y-2">
        <Label>Description</Label>
        <Input type="text" {...register("description")} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Tasks</Label>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={tasks.at(-1)?.title === ""}
            onClick={() => append({ title: "" })}
          >
            <Plus className="h-4 w-4 mr-1" /> Add task
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            No tasks yet — click “<span className="text-xl">+ </span>Add task”
            to create one.
          </p>
        ) : (
          fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder={`Task ${index + 1}`}
                {...register(`tasks.${index}.title` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
              >
                ✕
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="w-full flex items-center gap-4">
        <div className="w-full flex flex-col gap-3">
          <Label className="px-1">Assign to</Label>
          <Controller
            name="assignedTo"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                options={teams}
                value={teams.find((team) => team.name === value) || null}
                onChange={(selectedOption) =>
                  onChange(selectedOption ? selectedOption.name : "")
                }
                placeholder="Select Team..."
                isClearable
              />
            )}
          />
        </div>

        <div className="w-full flex flex-col gap-3">
          <Label className="px-1">Deadline</Label>
          <Controller
            name="deadline"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DatePicker value={value} onChange={onChange} />
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-center p-4">
        <Button
          type="submit"
          disabled={title === "" || title === project?.title}
        >
          {project ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
