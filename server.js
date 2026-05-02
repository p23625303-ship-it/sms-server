const express = require("express");
const cors = require("cors");
const solapi = require("solapi");

const app = express();

app.use(cors());
app.use(express.json());

// 서버 에러 나도 바로 꺼지지 않게
process.on("uncaughtException", (err) => {
  console.error("서버 에러:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Promise 에러:", err);
});

// 솔라피 API 정보
const messageService = new solapi.SolapiMessageService(
  "NCSKJ7YCLGWPZGTL",
  "RJH2IO8WENQ1CVBSZCHRIJPQXPFQYR9C"
);

// 문자 발송
app.post("/send-sms", async (req, res) => {
  const { phone, number } = req.body;

  if (!phone || !number) {
    return res.send({
      success: false,
      message: "전화번호 또는 대기번호가 없습니다."
    });
  }

  try {
    await messageService.send({
      to: phone,
      from: "01023625303",
      text: `[동백담] 대기번호 ${number}번 고객님 지금 입장해주세요.`
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

// 서버 실행
app.listen(3001, () => {
  console.log("문자 서버 실행됨: http://localhost:3001");
});