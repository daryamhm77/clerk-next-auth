"use server";

import User from "../models/user.model";
import { dbConnect } from "../mongodb/db";
import { clerkClient } from "@clerk/nextjs/server";

// Clerk sends snake_case fields in webhook payloads (email_address) and
// camelCase from currentUser() / the backend SDK (emailAddress).
type ClerkEmailAddress = {
  emailAddress?: string;
  email_address?: string;
};

type ClerkUserInput = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  image_url?: string;
  imageUrl?: string;
  email_addresses?: ClerkEmailAddress[];
  emailAddresses?: ClerkEmailAddress[];
  username?: string | null;
  publicMetadata?: Record<string, unknown>;
};

export const createOrUpdateUser = async (userData: ClerkUserInput) => {
  try {
    await dbConnect();

    let email_addresses = userData.email_addresses || userData.emailAddresses;
    
    // If email addresses are not in the basic user object, fetch full user data
    if (!email_addresses || email_addresses.length === 0) {
      const client = await clerkClient();
      const fullUser = await client.users.getUser(userData.id);
      email_addresses = fullUser.emailAddresses;
    }
    
    if (!email_addresses || email_addresses.length === 0) {
      throw new Error("User has no email address");
    }

    const primaryEmail =
      email_addresses[0]?.emailAddress ?? email_addresses[0]?.email_address;
    if (!primaryEmail) {
      throw new Error("User has no email address");
    }

    return await User.findOneAndUpdate(
      { clerkId: userData.id },
      {
        $set: {
          firstName: userData.first_name ?? userData.firstName ?? "",
          lastName: userData.last_name ?? userData.lastName ?? "",
          avatar: userData.image_url ?? userData.imageUrl ?? "",
          email: primaryEmail,
          username: userData.username ?? primaryEmail.split("@")[0],
        },
      },
      { new: true, upsert: true }
    );
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
};

/**
 * Get the MongoDB user for a Clerk user, creating it (and storing its id in
 * Clerk publicMetadata.userMongoId) on first access.
 *
 * Also scrubs the legacy `favs` mirror from publicMetadata: favorites used to
 * be duplicated into Clerk metadata, but MongoDB is the sole source of truth
 * now. Setting a metadata key to null deletes it (Clerk merges patches).
 */
export const getDbUser = async (clerkUser: ClerkUserInput) => {
  await dbConnect();

  const metadata = clerkUser.publicMetadata ?? {};
  const mongoId = metadata.userMongoId as string | undefined;

  let dbUser = mongoId ? await User.findById(mongoId) : null;

  if (!dbUser) {
    dbUser = await createOrUpdateUser(clerkUser);
  }

  const needsMongoId = mongoId !== dbUser._id.toString();
  const hasLegacyFavs = "favs" in metadata;

  if (needsMongoId || hasLegacyFavs) {
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        userMongoId: dbUser._id.toString(),
        ...(hasLegacyFavs ? { favs: null } : {}),
      },
    });
  }

  return dbUser;
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
