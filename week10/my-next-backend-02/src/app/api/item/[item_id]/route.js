// src/app/api/item/[item_id]/route.js

import { verifyJWT } from "@/lib/auth";
import { getClientPromise } from "@/lib/mongodb";

import {
  errorResponse,
  printExceptionLog,
  successResponse,
} from "@/lib/utils";

import { ObjectId } from "mongodb";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(request, { params }) {
  const user = verifyJWT(request);

  if (!user) {
    return errorResponse("Unauthorized Request", 401);
  }

  const { item_id } = await params;

  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);

    const item = await db
      .collection("item")
      .findOne({ _id: new ObjectId(item_id) });

    if (item) {
      // Audit Log
      await db.collection("audit_log").insertOne({
        userId: user.id,
        username: user.username,
        action: "VIEW_ITEM",
        itemId: item._id,
        itemName: item.name,
        timestamp: new Date(),
      });

      return successResponse(
        {
          item,
        },
        201,
      );
    } else {
      return errorResponse("Item not found", 404);
    }
  } catch (error) {
    printExceptionLog("GET Item Exception", error);
    return errorResponse("GET Item Internal Error", 500);
  }
}

export async function DELETE(request, { params }) {
  const user = verifyJWT(request);

  if (!user) {
    return errorResponse("Unauthorized Request", 401);
  }

  const { item_id } = await params;

  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);

    // Get item before deleting
    const item = await db
      .collection("item")
      .findOne({ _id: new ObjectId(item_id) });

    if (!item) {
      return errorResponse("Item not found", 404);
    }

    const updateResult = await db
      .collection("item")
      .updateOne(
        { _id: new ObjectId(item_id) },
        { $set: { status: "DELETED" } },
      );

    if (updateResult.matchedCount === 0) {
      return errorResponse("Item not found", 404);
    }

    // Audit Log
    await db.collection("audit_log").insertOne({
      userId: user.id,
      username: user.username,
      action: "DELETE",
      itemId: item._id,
      itemName: item.name,
      timestamp: new Date(),
    });

    return successResponse(
      { message: "Soft Delete Success" },
      200,
    );
  } catch (error) {
    printExceptionLog("DELETE Item Exception", error);
    return errorResponse("DELETE Item Internal Error", 500);
  }
}

export async function PUT(request, { params }) {
  const user = verifyJWT(request);

  if (!user) {
    return errorResponse("Unauthorized Request", 401);
  }

  const { item_id } = await params;

  console.log("==>itemd id: ", item_id);

  try {
    const data = await request.json();

    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);

    const storedItem = await db
      .collection("item")
      .findOne({ _id: new ObjectId(item_id) });

    if (storedItem) {
      storedItem.name = data.name;
      storedItem.price = data.price;
      storedItem.amount = data.amount;
      storedItem.category = data.category;

      const updatedResult = await db
        .collection("item")
        .updateOne(
          { _id: new ObjectId(item_id) },
          { $set: storedItem },
        );

      console.log("==>update result: ", updatedResult);

      const updateOk = Number(updatedResult.modifiedCount) > 0;

      if (updateOk) {
        // Audit Log
        await db.collection("audit_log").insertOne({
          userId: user.id,
          username: user.username,
          action: "UPDATE",
          itemId: storedItem._id,
          itemName: storedItem.name,
          timestamp: new Date(),
        });

        return successResponse(
          { message: "Item update success" },
          201,
        );
      } else {
        return errorResponse(
          { message: "Item update failed" },
          400,
        );
      }
    } else {
      return errorResponse(
        { message: "Item not found" },
        400,
      );
    }
  } catch (error) {
    printExceptionLog("PUT Item Exception", error);
    return errorResponse("PUT Item Internal Error", 500);
  }
}