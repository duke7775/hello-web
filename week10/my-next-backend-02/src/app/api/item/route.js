import { verifyJWT } from "@/lib/auth";
import { getClientPromise } from "@/lib/mongodb";

import {
  errorResponse,
  printExceptionLog,
  successResponse,
} from "@/lib/utils";

export async function GET(request) {
  const user = verifyJWT(request);

  if (!user) {
    return errorResponse("Unauthorized Request", 401);
  }

  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);

    const itemList = await db
      .collection("item")
      .find({ status: { $ne: "DELETED" } })
      .toArray();

    // Audit Log
    await db.collection("audit_log").insertOne({
      userId: user.id,
      username: user.username,
      action: "VIEW_ITEMS",
      timestamp: new Date(),
    });

    return successResponse({ itemList }, 201);
  } catch (error) {
    printExceptionLog("GET Items", error);
    return errorResponse("GET Item Internal Error", 500);
  }
}

export async function POST(request) {
  const user = verifyJWT(request);

  if (!user) {
    return errorResponse("Unauthorized Request", 401);
  }

  try {
    const data = await request.json();

    const name = data.name;
    const category = data.category;
    const price = data.price;
    const amount = data.amount;

    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);

    const insertResult = await db.collection("item").insertOne({
      name: name,
      category: category,
      price: price,
      amount: amount,
      status: "ACTIVE",
    });

    // Audit Log
    await db.collection("audit_log").insertOne({
      userId: user.id,
      username: user.username,
      action: "CREATE",
      itemId: insertResult.insertedId,
      itemName: name,
      timestamp: new Date(),
    });

    return successResponse(
      {
        id: insertResult.insertedId,
      },
      201,
    );
  } catch (error) {
    printExceptionLog("POST Items", error);
    return errorResponse("POST Item Internal Error", 500);
  }
}