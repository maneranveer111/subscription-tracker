import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

// Config must be set before the app is imported. None of these tests need a database.
process.env.MONGO_URI = "mongodb://127.0.0.1:1/unused";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.CRON_SECRET = "test-cron-secret";
process.env.CLIENT_URL = "http://localhost:5173";

let server;
let base;

before(async () => {
  const { default: app } = await import("../src/app.js");
  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

const call = async (method, path, { body, headers = {} } = {}) => {
  const res = await fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { res, json: await res.json().catch(() => null) };
};

test("GET /health returns ok", async () => {
  const { res, json } = await call("GET", "/health");
  assert.equal(res.status, 200);
  assert.deepEqual(json, { status: "ok" });
});

test("helmet security headers are set and Express is not advertised", async () => {
  const { res } = await call("GET", "/health");
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.equal(res.headers.get("x-powered-by"), null);
});

test("unknown routes return a JSON 404", async () => {
  const { res, json } = await call("GET", "/api/nope");
  assert.equal(res.status, 404);
  assert.match(json.message, /Route not found/);
});

test("protected routes reject requests without a valid token", async () => {
  assert.equal((await call("GET", "/api/subscriptions")).res.status, 401);
  assert.equal((await call("GET", "/api/summary")).res.status, 401);
  assert.equal(
    (await call("GET", "/api/summary", { headers: { Authorization: "Bearer garbage" } })).res.status,
    401
  );
});

test("an expired token is rejected", async () => {
  const expired = jwt.sign({ id: "64b000000000000000000001" }, "test-jwt-secret", { expiresIn: -10 });
  const { res } = await call("GET", "/api/summary", { headers: { Authorization: `Bearer ${expired}` } });
  assert.equal(res.status, 401);
});

test("creating a subscription validates input before touching the database", async () => {
  const token = jwt.sign({ id: "64b000000000000000000001" }, "test-jwt-secret");
  const { res, json } = await call("POST", "/api/subscriptions", {
    body: { name: "", cost: -5 },
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 400);
  assert.ok(json.message.length > 0);
});

test("profile update rejects a non-string name instead of crashing", async () => {
  const token = jwt.sign({ id: "64b000000000000000000001" }, "test-jwt-secret");
  const { res } = await call("PUT", "/api/auth/profile", {
    body: { name: 123 },
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 400);
});

test("malformed JSON returns 400", async () => {
  const res = await fetch(base + "/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{bad json",
  });
  assert.equal(res.status, 400);
});

test("the cron webhook rejects a missing or wrong secret", async () => {
  assert.equal((await call("POST", "/api/internal/reminders")).res.status, 401);
  const wrong = await call("POST", "/api/internal/reminders", { headers: { "X-Cron-Secret": "nope" } });
  assert.equal(wrong.res.status, 401);
});

test("login is rate limited after 10 failed attempts", async () => {
  const statuses = [];
  for (let i = 0; i < 12; i++) {
    const { res } = await call("POST", "/api/auth/login", { body: {} }); // invalid body = failed attempt
    statuses.push(res.status);
  }
  assert.equal(statuses[0], 400);
  assert.equal(statuses[9], 400);
  assert.equal(statuses[10], 429);
});
