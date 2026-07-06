import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const {
        id: clerkId,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username,
      } = evt.data;

      if (!clerkId) {
        return new Response("Missing user id", { status: 400 });
      }

      await createOrUpdateUser(
        clerkId,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username
      );
    }

    if (evt.type === "user.deleted") {
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
