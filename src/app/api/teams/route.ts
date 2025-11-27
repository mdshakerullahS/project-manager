import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Team, { ITeam } from "../../models/Team";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    let teams: ITeam[] | [] = [];
    if (loggedInUser?.accountType === "Workspace") {
      teams = await Team.find({ creator: loggedInUser._id });
    }
    if (loggedInUser?.accountType === "Individual") {
      teams = await Team.find({ members: loggedInUser._id });
    }

    if (!teams)
      return NextResponse.json({ message: "Teams not found" }, { status: 404 });

    return NextResponse.json({ teams }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      { message: "Error getting project" },
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

    const { name, operator, members } = await req.json();
    if (!name || !operator || !Array.isArray(members) || !members.length) {
      return NextResponse.json(
        { message: "Please fill required fields" },
        { status: 400 }
      );
    }

    const team = await Team.create({
      name,
      creator: loggedInUser._id,
      operator,
      members,
    });

    return NextResponse.json(
      {
        message: "Team created successfully",
        team,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { message: "Error creating team" },
      { status: 400 }
    );
  }
}
