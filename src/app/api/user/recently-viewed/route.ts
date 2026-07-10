import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { dbConnect } from "@/lib/mongodb/db";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { movieId, title, image, year } = await req.json();

    await User.findByIdAndUpdate(user.publicMetadata.userMongoId, {
      $pull: { recentlyViewed: { movieId } },
    });

    await User.findByIdAndUpdate(user.publicMetadata.userMongoId, {
      $push: {
        recentlyViewed: {
          $each: [{ movieId, title, image, year, viewedAt: new Date() }],
          $position: 0,
          $slice: 20,
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error recording recently viewed:", error);
    return NextResponse.json(
      { error: "Error recording recently viewed" },
      { status: 500 }
    );
  }
}
