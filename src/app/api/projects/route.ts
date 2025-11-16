import Project from "@/src/app/models/Project";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Task from "@/src/app/models/Task";
import { checkAuth } from "@/src/lib/checkAuth";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    const projects = await Project.find({ creator: loggedInUser });

    if (!projects)
      return NextResponse.json(
        { message: "Projects not found" },
        { status: 404 }
      );

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      { message: "Error getting project" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser, accountType } =
      await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (accountType !== "Workspace")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title, description, tasks, status, deadline, assignedTo } =
      await req.json();
    if (!title) {
      return NextResponse.json(
        { message: "Please enter project title" },
        { status: 400 }
      );
    }

    const project = await Project.create({
      title,
      description,
      status,
      deadline,
      creator: loggedInUser,
      assignedTo,
    });

    const createdTasks = [];
    if (Array.isArray(tasks) && tasks.length > 0) {
      for (const task of tasks) {
        const newTask = await Task.create({
          title: task.title,
          status: task.status,
          project: project._id,
        });
        createdTasks.push(newTask);
      }
    }

    return NextResponse.json(
      {
        message: "Project created successfully",
        project: {
          ...project.toObject(),
          tasks: createdTasks,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      { message: "Error creating project" },
      { status: 400 }
    );
  }
}
