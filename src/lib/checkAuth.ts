import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function checkAuth() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { ok: false, message: "Unauthorized", resStatus: 401 };
    }

    const loggedInUser = session.user.id;
    const accountType = session.user.accountType;
    const email = session.user.email;

    return { ok: true, loggedInUser, accountType, email };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Internal Server Error", resStatus: 500 };
  }
}
