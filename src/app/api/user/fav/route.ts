import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { getDbUser } from "@/lib/actions/user";

export async function PUT(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUser = await getDbUser(user);
    const data = await req.json();
    const list = data.list || "favorite";

    // Each (movieId, list) pair is independent: toggling one list
    // never affects the movie's membership in the other lists.
    const existing = dbUser.favs?.find(
      (fav: { movieId: string; list: string }) =>
        fav.movieId === data.movieId && fav.list === list
    );

    const updatedUser = existing
      ? await User.findByIdAndUpdate(
          dbUser._id,
          { $pull: { favs: { movieId: data.movieId, list } } },
          { new: true }
        )
      : await User.findByIdAndUpdate(
          dbUser._id,
          {
            $push: {
              favs: {
                movieId: data.movieId,
                title: data.title,
                description: data.description,
                dateReleased: data.dateReleased,
                rating: data.rating,
                image: data.image,
                list,
              },
            },
          },
          { new: true }
        );

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating favorites:", error);
    return NextResponse.json(
      { error: "Error updating favorites" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUser = await getDbUser(user);

    const { searchParams } = new URL(req.url);
    const list = searchParams.get("list");
    const movieId = searchParams.get("movieId");

    let favs = dbUser.favs ?? [];

    // Membership lookup for a single movie: which lists is it in?
    if (movieId) {
      const lists = favs
        .filter((f: { movieId: string }) => f.movieId === movieId)
        .map((f: { list: string }) => f.list);
      return NextResponse.json({ lists }, { status: 200 });
    }

    if (list && ["favorite", "watchlist", "watched"].includes(list)) {
      favs = favs.filter((f: { list: string }) => f.list === list);
    }

    return NextResponse.json({ favs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Error fetching favorites" },
      { status: 500 }
    );
  }
}
