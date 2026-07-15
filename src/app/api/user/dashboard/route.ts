import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getDbUser } from "@/lib/actions/user";
import {
  computeDashboardData,
  toFavItems,
  toRecentlyViewedItems,
} from "@/lib/dashboard";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUser = await getDbUser(user);

    const data = computeDashboardData(
      toFavItems(dbUser.favs),
      toRecentlyViewedItems(dbUser.recentlyViewed)
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard" },
      { status: 500 }
    );
  }
}
