import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { dbConnect } from "@/lib/mongodb/db";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const existingUser = await User.findById(user.publicMetadata.userMongoId);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const favs = existingUser.favs ?? [];
    const recentlyViewed = existingUser.recentlyViewed ?? [];

    const totalFavorites = favs.filter(
      (f: { list: string }) => f.list === "favorite"
    ).length;
    const totalWatchlist = favs.filter(
      (f: { list: string }) => f.list === "watchlist"
    ).length;
    const totalWatched = favs.filter(
      (f: { list: string }) => f.list === "watched"
    ).length;

    const topRated = [...favs]
      .filter((f: { rating: string }) => f.rating && f.rating !== "N/A")
      .sort(
        (a: { rating: string }, b: { rating: string }) =>
          parseFloat(b.rating) - parseFloat(a.rating)
      )
      .slice(0, 10);

    return NextResponse.json(
      {
        stats: { totalFavorites, totalWatchlist, totalWatched, total: favs.length },
        recentlyViewed: recentlyViewed.slice(0, 10),
        topRated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard" },
      { status: 500 }
    );
  }
}
