import Project, { IProject } from "@/src/app/models/Project";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Task from "@/src/app/models/Task";
import { checkAuth } from "@/src/lib/checkAuth";
import Team from "../../models/Team";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (!loggedInUser?.accountType)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let projects: IProject[] = [];
    if (loggedInUser.accountType === "Workspace") {
      projects = await Project.find({ creator: loggedInUser._id });
    }
    if (loggedInUser.accountType === "Individual") {
      const teams = await Team.find({ operator: loggedInUser._id }).select(
        "_id"
      );
      const teamIds = teams.map((t) => t._id);

      projects = await Project.find({ assignedTo: { $in: teamIds } });
    }

    if (!projects.length)
      return NextResponse.json(
        { message: "Projects not found" },
        { status: 200 }
      );

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      { message: "Error getting projects" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (loggedInUser?.accountType !== "Workspace")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title, description, tasks, status, deadline, assignedTo } =
      await req.json();
    if (!title)
      return NextResponse.json(
        { message: "Please enter project title" },
        { status: 400 }
      );

    const project = await Project.create({
      title,
      description,
      status,
      deadline,
      creator: loggedInUser._id,
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
