import { NextRequest, NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import User from "@/lib/models/user.model";
import { dbConnect } from "@/lib/mongodb/db";

export async function PUT(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const list = data.list || "favorite";

    const existingUser = await User.findById(user.publicMetadata.userMongoId);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = existingUser.favs?.find(
      (fav: { movieId: string }) => fav.movieId === data.movieId
    );

    if (existing) {
      if (existing.list === list) {
        const updatedUser = await User.findByIdAndUpdate(
          user.publicMetadata.userMongoId,
          { $pull: { favs: { movieId: data.movieId } } },
          { new: true }
        );
        const updatedFavs = updatedUser.favs.map(
          (fav: { movieId: string; list: string }) => ({
            movieId: fav.movieId,
            list: fav.list,
          })
        );
        const client = await clerkClient();
        await client.users.updateUserMetadata(user.id, {
          publicMetadata: { favs: updatedFavs },
        });
        return NextResponse.json(updatedUser, { status: 200 });
      }

      const updatedUser = await User.findOneAndUpdate(
        {
          _id: user.publicMetadata.userMongoId,
          "favs.movieId": data.movieId,
        },
        { $set: { "favs.$.list": list } },
        { new: true }
      );
      const updatedFavs = updatedUser.favs.map(
        (fav: { movieId: string; list: string }) => ({
          movieId: fav.movieId,
          list: fav.list,
        })
      );
      const client = await clerkClient();
      await client.users.updateUserMetadata(user.id, {
        publicMetadata: { favs: updatedFavs },
      });
      return NextResponse.json(updatedUser, { status: 200 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.publicMetadata.userMongoId,
      {
        $addToSet: {
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
    const updatedFavs = updatedUser.favs.map(
      (fav: { movieId: string; list: string }) => ({
        movieId: fav.movieId,
        list: fav.list,
      })
    );
    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { favs: updatedFavs },
    });
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
    await dbConnect();
    const existingUser = await User.findById(user.publicMetadata.userMongoId);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const list = searchParams.get("list");

    let favs = existingUser.favs ?? [];
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
