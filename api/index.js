const app = require("express")();
const { v4 } = require("uuid");

app.get("/api", (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

module.exports = app;

// import express from "express";
// import * as dotenv from "dotenv";
// import cors from "cors";
// import { Configuration, OpenAIApi } from "openai";

// dotenv.config();

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/", async (req, res) => {
//   console.log("Generating...");
//   try {
//     const prompt = req.body.prompt;

//     console.log("PROMPT", prompt);

//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     });

//     console.log("RESPONSE", response.data.choices[0].message.content);

//     res.status(200).send({
//       bot: response.data.choices[0].message.content,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error || "Something went wrong");
//   }
// });

// app.listen(5001, () =>
//   console.log("AI server started on http://localhost:5001")
// );

// module.exports = app;