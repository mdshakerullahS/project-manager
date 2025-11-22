import Proposal, { IProposal } from "@/src/app/models/Proposal";
import User from "@/src/app/models/User";
import Workspace from "@/src/app/models/Workspace";
import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser } = await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    let proposals: IProposal[] = [];
    if (loggedInUser?.accountType === "Individual")
      proposals = await Proposal.find({
        employeeEmail: loggedInUser.email,
      }).populate("workspace");

    if (loggedInUser?.accountType === "Workspace")
      proposals = await Proposal.find({
        workspace: loggedInUser?._id,
      }).populate("workspace");

    if (!proposals.length)
      return NextResponse.json(
        { message: "No proposal found" },
        { status: 200 }
      );

    return NextResponse.json({ proposals }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Error fetching proposals" },
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

    const { email } = await req.json();
    if (!email)
      return NextResponse.json(
        { message: "Provide employee's email" },
        { status: 400 }
      );

    const isExists = await User.findOne({ email });
    if (!isExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (isExists.accountType === "Workspace")
      return NextResponse.json(
        { message: "User not allowed to join workspaces" },
        { status: 403 }
      );

    const isEmployee = await Workspace.findOne({
      account: loggedInUser._id,
      employees: isExists._id,
    });
    if (isEmployee)
      return NextResponse.json(
        {
          message: `${isExists.name
            .split(" ")
            .slice(0, 2)
            .join(" ")}'s your employee`,
        },
        { status: 200 }
      );

    const isProposal = await Proposal.findOne({
      workspace: loggedInUser._id,
      employeeEmail: email,
    });
    if (isProposal)
      return NextResponse.json(
        { message: "Proposal already sent" },
        { status: 409 }
      );

    await Proposal.create({
      workspace: loggedInUser._id,
      employeeEmail: email,
    });

    return NextResponse.json(
      { message: "Proposal sent successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Failed to send proposal" },
      { status: 400 }
    );
  }
}
