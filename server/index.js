// index.js
const express = require("express");

const app = express();
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

app.get("/about", (req, res) => {
  res.send("This is my about route..... ");
});

// Export the Express API
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
