import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextResponse } from "next/server";
import Task from "../../models/Task";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    const tasks = await Task.find({ assignedTo: loggedInUser });

    if (!tasks)
      return NextResponse.json({ message: "Tasks not found" }, { status: 404 });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      { message: "Error getting tasks" },
      { status: 400 }
    );
  }
}
