import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Task from "../../models/Task";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (loggedInUser?.accountType !== "Individual")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const tasks = await Task.find({ assignedTo: loggedInUser?._id });
    if (!tasks)
      return NextResponse.json({ message: "Tasks not found" }, { status: 200 });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      { message: "Error getting tasks" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (loggedInUser?.accountType !== "Individual")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title, status } = await req.json();
    if (!title) {
      return NextResponse.json(
        { message: "Please provide task title" },
        { status: 400 }
      );
    }

    const task = await Task.create({
      creator: loggedInUser._id,
      title,
      status,
      assignedTo: loggedInUser._id,
    });

    return NextResponse.json(
      {
        message: "Task created successfully",
        task,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { message: "Error creating task" },
      { status: 400 }
    );
  }
}
