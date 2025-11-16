import Request from "@/src/app/models/Request";
import User from "@/src/app/models/User";
import { checkAuth } from "@/src/lib/checkAuth";
import dbConnect from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const { ok, message, resStatus, loggedInUser, accountType, email } =
      await checkAuth();
    if (!ok) return NextResponse.json({ message }, { status: resStatus });

    const query =
      accountType === "Individual"
        ? { employeeEmail: email }
        : { workspace: loggedInUser };

    const requests = await Request.find(query).lean();

    if (!requests || requests.length === 0)
      return NextResponse.json(
        { message: "No request found" },
        { status: 404 }
      );

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Error fetching requests" },
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

    const { email } = await req.json();
    if (!email)
      return NextResponse.json(
        { message: "Provide employee's email" },
        { status: 400 }
      );

    const isExists = await User.findOne({ email });

    if (isExists && isExists.accountType === "Workspace") {
      return NextResponse.json(
        { message: "User not allowed join workspaces" },
        { status: 400 }
      );
    }

    await Request.create({
      workSpace: loggedInUser,
      employeeEmail: email,
    });

    return NextResponse.json(
      { message: "Request sent successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Failed to send request" },
      { status: 400 }
    );
  }
}
