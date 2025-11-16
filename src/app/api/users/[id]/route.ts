import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/User";
import Workspace from "@/src/app/models/Workspace";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    await dbConnect();

    const updated = await User.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await Workspace.create({
      account: id,
      employees: [],
    });

    return NextResponse.json(
      { updated, message: "User updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 400 }
    );
  }
}
