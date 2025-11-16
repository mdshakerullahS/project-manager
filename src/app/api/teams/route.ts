import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Team from "../../models/Team";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    const teams = Team.find({ creator: loggedInUser });

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

    const { ok, message, resStatus, loggedInUser, accountType } =
      await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (accountType !== "Workspace")
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
      creator: loggedInUser,
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
