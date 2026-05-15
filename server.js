require("dotenv").config();

const express = require("express");
const cors = require("cors");
const solapi = require("solapi");

const app = express();

app.use(cors());
app.use(express.json());

process.on("uncaughtException", (err) => {
  console.error("서버 에러:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Promise 에러:", err);
});

const messageService = new solapi.SolapiMessageService(
  process.env.SOLAPI_API_KEY,
  process.env.SOLAPI_API_SECRET
);

app.post("/send-sms", async (req, res) => {
  const { phone, number } = req.body;

  if (!phone || !number) {
    return res.send({
      success: false,
      message: "전화번호 또는 대기번호가 없습니다."
    });
  }

  let formattedPhone = String(phone).replace(/[\s-]/g, "");

  if (formattedPhone.startsWith("010")) {
    formattedPhone = "+82" + formattedPhone.substring(1);
  }

  try {
    await messageService.send({
      to: formattedPhone,
      from: process.env.SEND_PHONE,
      text: `[동백] 대기번호 ${number}번 고객님, 입장해주세요.`
    });

    res.send({
      success: true,
      message: "문자 발송 완료"
    });

  } catch (error) {
    console.error("문자 발송 실패:", error);

    res.send({
      success: false,
      message: "문자 발송 실패"
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`문자 서버 실행됨: http://localhost:${PORT}`);
});