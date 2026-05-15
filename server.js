require("dotenv").config();

const express = require("express");
const cors = require("cors");
const solapi = require("solapi");

const app = express();

app.use(cors());
app.use(express.json());

const messageService = new solapi.SolapiMessageService(
  process.env.SOLAPI_API_KEY,
  process.env.SOLAPI_API_SECRET
);

app.get("/", (req, res) => {
  res.send("sms server running");
});

app.post("/send-sms", async (req, res) => {
  const { to, text } = req.body;

  try {
    const result = await messageService.send({
      to: to,
      from: process.env.SEND_PHONE,
      text: text,
    });

    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`서버 실행됨 ${PORT}`);
});