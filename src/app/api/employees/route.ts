import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Workspace from "../../models/Workspace";
import User from "../../models/User";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser, accountType } =
      await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (accountType !== "Workspace")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const workspace = await Workspace.findOne({ account: loggedInUser }).lean();

    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    const employees = await User.find({
      _id: { $in: workspace.employees },
    }).lean();

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

    const { ok, message, resStatus, loggedInUser, accountType } =
      await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (accountType !== "Individual")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { isAccepted, workspaceID } = await req.json();

    if (!isAccepted) {
      return NextResponse.json(
        { message: "Request declined." },
        { status: 200 }
      );
    }

    const workspace = await Workspace.findById(workspaceID);

    if (!workspace)
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );

    workspace.employees.push(Object(loggedInUser));

    await workspace.save();

    return NextResponse.json(
      { message: "Request accepted. Added to workspace." },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Error accepting request" },
      { status: 400 }
    );
  }
}
