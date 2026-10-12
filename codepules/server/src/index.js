import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import bcrypt from "bcryptjs";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { signToken, requireAuth } from "./auth.js";

const prisma = new PrismaClient();
const app = express();
const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(cors({ origin }));
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, app: "CodePules" }));

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ error: "Name, email and a 6+ character password are required." });
  if (await prisma.user.findUnique({ where: { email } }))
    return res.status(409).json({ error: "That email is already registered." });
  const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10), role: role === "TEACHER" ? "TEACHER" : "STUDENT" },
  });
  res.json({ token: signToken(user), user: { id: user.id, name, email, role: user.role } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = await prisma.user.findUnique({ where: { email: email || "" } });
  if (!user || !(await bcrypt.compare(password || "", user.password)))
    return res.status(401).json({ error: "Email or password is wrong." });
  res.json({ token: signToken(user), user: { id: user.id, name: user.name, email, role: user.role } });
});

app.get("/api/me", requireAuth(), async (req, res) => {
  const u = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role });
});

// Phase 5 will fill this in: join session, push questions, receive anti-cheat events.
const server = http.createServer(app);
const io = new Server(server, { cors: { origin } });
io.on("connection", (socket) => socket.emit("hello", "Connected to CodePules"));

server.listen(process.env.PORT || 4000, () =>
  console.log(`CodePules server on http://localhost:${process.env.PORT || 4000}`));
