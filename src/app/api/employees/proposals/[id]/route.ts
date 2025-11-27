import Proposal from "@/src/app/models/Proposal";
import Workspace from "@/src/app/models/Workspace";
import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    if (!loggedInUser)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return NextResponse.json(
        { message: "Proposal not found" },
        { status: 404 }
      );
    }

    const { accept, decline } = await req.json();

    if (!accept && !decline)
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 400 }
      );

    if (decline) {
      await proposal.deleteOne();

      return NextResponse.json(
        { message: "Proposal declined" },
        { status: 200 }
      );
    }

    if (accept) {
      const workspace = await Workspace.findById(proposal.workspace);
      if (!workspace)
        return NextResponse.json(
          { message: "Workspace not found" },
          { status: 404 }
        );

      workspace?.employees.push(loggedInUser._id);

      await workspace.save();

      return NextResponse.json(
        { message: "Proposal accepted" },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to send proposal" },
      { status: 400 }
    );
  }
}
