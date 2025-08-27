const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');
const PORT = 8080;

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get('/', async (_req, res) => {
  const data = await prisma.user.findMany();
  res.json({
    success: true,
    users: data,
  });
});

app.post("/", async (req, res) => {
  if(!req.body.email || !req.body.name) {
    return res.status(400).json({ success: false, message: "Email and name are required" });
  }

  const newUser = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
    },
  });

  res.status(201).json({
    success: true,
    user: newUser,
  });
});

app.listen(PORT, () => {
  console.log('Server is running on port 8080');
});
