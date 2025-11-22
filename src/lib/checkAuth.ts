import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";

export interface LoggedInUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image?: string;
  accountType?: string | null;
}

export async function checkAuth() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.accountType) {
      return { ok: false, message: "Unauthorized", resStatus: 401 };
    }

    const loggedInUser: LoggedInUser = {
      _id: new Types.ObjectId(session.user.id),
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      accountType: session.user.accountType,
    };

    return { ok: true, loggedInUser };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Internal Server Error", resStatus: 500 };
  }
}
