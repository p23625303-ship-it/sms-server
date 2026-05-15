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
  const { phone, number } = req.body;

  const formattedPhone = String(phone).replace(/[^0-9]/g, "");

  try {
    await messageService.send({
      to: formattedPhone,
      from: process.env.SEND_PHONE,
      text: `[동백담] 대기번호 ${number}번 고객님, 입장해주세요.`
    });

    res.json({ success: true });
  } catch (err) {
    console.error("문자 발송 실패:", err);
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`서버 실행됨 ${PORT}`);
});