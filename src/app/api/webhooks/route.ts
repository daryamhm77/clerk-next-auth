import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
import { dbConnect } from "@/lib/mongodb/db";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id: clerkId } = evt.data;

      if (!clerkId) {
        return new Response("Missing user id", { status: 400 });
      }

      await dbConnect();
      const user = await createOrUpdateUser({ ...evt.data, id: clerkId });

      const client = await clerkClient();
      await client.users.updateUserMetadata(clerkId, {
        publicMetadata: {
          userMongoId: user._id.toString(),
        },
      });
    }

    if (eventType === "user.updated") {
      const { id: clerkId } = evt.data;

      if (!clerkId) {
        return new Response("Missing user id", { status: 400 });
      }

      await createOrUpdateUser({ ...evt.data, id: clerkId });
    }

    if (eventType === "user.deleted") {
      if (!id) {
        return new Response("Missing user id", { status: 400 });
      }
      await deleteUser(id);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
