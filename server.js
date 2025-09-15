import express from "express";
import fs from "fs";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());

// ✅ Разрешаем фронту ходить к API
app.use(cors({ origin: "http://localhost:5174" }));

// 🔑 Твой ключ
const API_KEY = "AIzaSyCEdoj22aPqO7kZQ-SsMd0VbaUi1Qus_Zk";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

// 📂 Загружаем базу
function loadData() {
  const raw = fs.readFileSync("data.json", "utf-8");
  return JSON.parse(raw);
}

// 📅 сортировка по дате
function sortByDate(events) {
  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  const events = loadData();

  const lowerQ = question.toLowerCase();

  // 🔎 Фильтруем по городу или событию
  let matches = events.filter(
    (e) =>
      lowerQ.includes(e.city.toLowerCase()) ||
      lowerQ.includes(e.event.toLowerCase())
  );

  // 📌 Если запрос содержит "ближайшие" — берём все события и сортируем по дате
  if (lowerQ.includes("ближайшие") || matches.length === 0) {
    matches = sortByDate(events).slice(0, 5); // например, только 5 ближайших
  }

  const contextText =
    matches.length > 0
      ? `Вот события в базе:\n${matches
          .map(
            (e) =>
              `- ${e.event} (${e.city}, ${e.date}), цена ${e.price} тг. Оплата: ${e.paymentLink}`
          )
          .join("\n")}`
      : "В базе нет подходящих событий.";

  const prompt = `
Ты ассистент сервиса продажи билетов. 
Вопрос пользователя: "${question}"

${contextText}

Твоя задача: 
- Если пользователь сказал "ближайшие" — просто перечисли ближайшие события из списка. 
- Если назвал город или событие — покажи совпадения. 
- Если хочет купить билет — предложи ссылку на оплату.
`;

  try {
    const resp = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await resp.json();
    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Нет ответа";

    res.json({ answer, matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при запросе к Gemini" });
  }
});

app.listen(3001, () =>
  console.log("✅ Backend запущен на http://localhost:3001")
);
