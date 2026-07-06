"use server";

import User from "../models/user.model";
import { dbConnect } from "../mongodb/db";

type ClerkEmailAddress = {
  email_address: string;
};

export const createOrUpdateUser = async (
  id: string,
  first_name: string | null,
  last_name: string | null,
  image_url: string,
  email_addresses: ClerkEmailAddress[],
  username: string | null
) => {
  try {
    await dbConnect();

    const primaryEmail = email_addresses[0]?.email_address;
    if (!primaryEmail) {
      throw new Error("User has no email address");
    }

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name ?? "",
          lastName: last_name ?? "",
          avatar: image_url,
          email: primaryEmail,
          username: username ?? primaryEmail.split("@")[0],
        },
      },
      { new: true, upsert: true }
    );

    return user;
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    await dbConnect();

    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
