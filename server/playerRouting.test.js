

import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Creates a mock database so tests don't touch production code
const sendMock = vi.fn();

vi.mock("./db.js", () => {
  return {
    db: { send: sendMock },
    TABLE_NAME: "HangmanPlayers",
  };
});

const { default: app } = await import("./app.js");

describe("Player API", () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  describe("GET /player/:name", () => {
    // Verifies handling of unauthenticated players
    it("returns 404 when player does not exist", async () => {
      sendMock.mockResolvedValueOnce({});

      const res = await request(app).get("/player/Paul");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Player not found.");
    });

    // Verifies handling of authenticated players
    it("returns 200 and player data when player exists", async () => {
      sendMock.mockResolvedValueOnce({
        Item: {
          name: "Paul",
          wins: 2,
          losses: 1,
        },
      });

      const res = await request(app).get("/player/Paul");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        name: "Paul",
        wins: 2,
        losses: 1,
      });
    });
  });

  describe("POST /player", () => {
    // Verifies player registration on success
    it("returns 201 when player is created", async () => {
      sendMock.mockResolvedValueOnce({});

      const res = await request(app).post("/player").send({ name: "Paul" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        name: "Paul",
        wins: 0,
        losses: 0,
      });
    });

    // Verifies error handling on repeat registration request
    it("returns 409 when username already exists", async () => {
      const error = new Error("duplicate");
      error.name = "ConditionalCheckFailedException";
      sendMock.mockRejectedValueOnce(error);

      const res = await request(app).post("/player").send({ name: "Paul" });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe("Username already exists.");
    });
  });
});