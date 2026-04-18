import express from "express";
import cors from "cors";
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

function normalizeName(name) {
  return String(name || "").trim();
}


function isValidName(name) {
  const trimmed = normalizeName(name);
  return trimmed.length >= 1 && trimmed.length <= 30;
}

app.get("/player/:name", async (req, res) => {
  const name = normalizeName(req.params.name);

  if (!isValidName(name)) {
    return res.status(400).json({ message: "Invalid username." });
  }

  try {
    const result = await db.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { name },
      })
    );

    if (!result.Item) {
      return res.status(404).json({ message: "Player not found." });
    }

    return res.status(200).json(result.Item);
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve player." });
  }
});

app.post("/player", async (req, res) => {
  const name = normalizeName(req.body?.name);

  if (!isValidName(name)) {
    return res.status(400).json({ message: "Invalid username." });
  }

  const newPlayer = {
    name,
    wins: 0,
    losses: 0,
  };

  try {
    await db.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: newPlayer,
        /* NEW: block duplicate usernames */
        ConditionExpression: "attribute_not_exists(#name)",
        ExpressionAttributeNames: {
          "#name": "name",
        },
      })
    );

    return res.status(201).json(newPlayer);
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return res.status(409).json({ message: "Username already exists." });
    }

    return res.status(500).json({ message: "Failed to create player." });
  }
});

app.put("/player/:name", async (req, res) => {
  const name = normalizeName(req.params.name);
  const wins = Number(req.body?.wins);
  const losses = Number(req.body?.losses);

  if (!isValidName(name)) {
    return res.status(400).json({ message: "Invalid username." });
  }

  if (
    !Number.isInteger(wins) ||
    !Number.isInteger(losses) ||
    wins < 0 ||
    losses < 0
  ) {
    return res
      .status(400)
      .json({ message: "Wins and losses must be non-negative integers." });
  }

  try {
    const result = await db.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { name },
        UpdateExpression: "SET wins = :wins, losses = :losses",

        ConditionExpression: "attribute_exists(#name)",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":wins": wins,
          ":losses": losses,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return res.status(200).json(result.Attributes);
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return res.status(404).json({ message: "Player not found." });
    }

    return res.status(500).json({ message: "Failed to update player." });
  }
});

export default app;