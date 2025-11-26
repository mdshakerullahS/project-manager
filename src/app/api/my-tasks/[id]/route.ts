import Task, { ITask } from "@/src/app/models/Task";
import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (loggedInUser?.accountType !== "Individual")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const task = await Task.findOne({ creator: loggedInUser._id, _id: id });

    if (!task)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

    return NextResponse.json({ task }, { status: 200 });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { message: "Error getting task" },
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

    const body: Partial<ITask> = await req.json();

    const updated = await Task.findOneAndUpdate(
      {
        _id: id,
        creator: loggedInUser?._id,
      },
      body,
      {
        new: true,
      }
    );

    if (!updated)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

    return NextResponse.json(
      { updated, message: "Task updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating task" },
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

    const deleted = await Task.findOneAndDelete({
      _id: id,
      creator: loggedInUser?._id,
    });
    if (!deleted)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

    return NextResponse.json(
      { deleted, message: "Task deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting task" },
      { status: 400 }
    );
  }
}
