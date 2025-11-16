import Task from "@/src/app/models/Task";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    await dbConnect();

    const updated = await Task.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

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

    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

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
