import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Workspace from "../../models/Workspace";
import User from "../../models/User";
import Request from "../../models/Proposal";
// import Task from "../../models/Task";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (loggedInUser?.accountType !== "Workspace")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const workspace = await Workspace.findOne({
      account: loggedInUser?._id,
    }).lean();

    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    const employees = await User.find({
      _id: { $in: workspace.employees },
    }).lean();

    if (!employees.length)
      return NextResponse.json(
        { message: "No employees found" },
        { status: 200 }
      );

    // const fullEmployees = [];
    // for (const employee of employees) {
    //   const currentProjectCount = await Task.countDocuments({
    //     assignedTo: employee._id,
    //   });

    //   const fullEmployee = { ...employee, currentProjectCount };

    //   fullEmployees.push(fullEmployee);
    // }

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Error getting employees" },
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

    const { isAccepted, workspaceID } = await req.json();

    const workspace = await Workspace.findById(workspaceID);
    if (!workspace)
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );

    await Request.findOneAndDelete({
      workspace: workspace._id,
      employeeEmail: loggedInUser.email,
    });

    if (isAccepted) {
      workspace.employees.push(loggedInUser._id);
      await workspace.save();

      return NextResponse.json(
        { message: "Request accepted. Added to workspace." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Request declined." },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Error accepting request" },
      { status: 400 }
    );
  }
}
