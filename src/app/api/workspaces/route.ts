import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextResponse } from "next/server";
import Workspace from "../../models/Workspace";
import Task from "../../models/Task";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (loggedInUser?.accountType !== "Individual")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const workspaces = await Workspace.find({
      employees: loggedInUser?._id,
    }).populate("account");

    if (!workspaces.length)
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 200 }
      );

    const fullWorkspaces = [];

    for (const ws of workspaces) {
      const count = await Task.countDocuments({
        creator: ws.account._id,
        assignedTo: loggedInUser._id,
      });

      fullWorkspaces.push({
        ...ws.toObject(),
        taskCount: count,
      });
    }

    return NextResponse.json({ workspaces: fullWorkspaces }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Error getting workspaces" },
      { status: 400 }
    );
  }
}
