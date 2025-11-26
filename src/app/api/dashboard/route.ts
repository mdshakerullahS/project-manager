import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextResponse } from "next/server";
import Project from "../../models/Project";
import Team from "../../models/Team";
import Workspace from "../../models/Workspace";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (loggedInUser?.accountType !== "Workspace")
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const projectCount = await Project.countDocuments({
      creator: loggedInUser._id,
    });
    const teamCount = await Team.countDocuments({ creator: loggedInUser._id });
    const workspace = await Workspace.findOne({ account: loggedInUser._id });
    const employeeCount = workspace?.employees.length;

    const projects = { title: "Projects", count: projectCount };
    const teams = { title: "Teams", count: teamCount };
    const employees = { title: "Employees", count: employeeCount };

    const data = [projects, teams, employees];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting data" },
      { status: 400 }
    );
  }
}
