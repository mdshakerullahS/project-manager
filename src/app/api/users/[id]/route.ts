import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/User";
import Workspace from "@/src/app/models/Workspace";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updated = await User.findByIdAndUpdate(session.user.id, body, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (body.accountType === "Workspace") {
      const isExist = await Workspace.findOne({ account: session.user.id });
      if (!isExist) {
        await Workspace.create({
          account: session.user.id,
          employees: [],
        });
      }
    }

    return NextResponse.json(
      { updated, message: "User updated" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json(
      { message: "Error updating user" },
      { status: 400 }
    );
  }
}
