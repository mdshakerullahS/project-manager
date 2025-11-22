import Project, { IProject } from "@/src/app/models/Project";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Task from "@/src/app/models/Task";
import { checkAuth } from "@/src/lib/checkAuth";

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    const project = await Project.findById(id);
    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    if (project.creator !== loggedInUser?._id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const tasks = await Task.find({
      project: id,
    }).lean();

    const fullProject = {
      ...project.toObject(),
      tasks,
    };

    return NextResponse.json({ fullProject }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error getting project" },
      { status: 400 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (loggedInUser?.accountType !== "Workspace")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body: Partial<IProject> = await req.json();

    const updated = await Project.findOneAndUpdate(
      { _id: id, creator: loggedInUser._id },
      body,
      {
        new: true,
      }
    );

    if (!updated)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { updated, message: "Project updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating project" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (loggedInUser?.accountType !== "Workspace")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await Task.deleteMany({ projectID: id });

    const deleted = await Project.findOneAndDelete({
      _id: id,
      creator: loggedInUser._id,
    });

    if (!deleted)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { deleted, message: "Project deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting project" },
      { status: 400 }
    );
  }
}
