import express from "express";
import connectToMongo from "./db/connection";
import cors from "cors";
import cookie from "cookie-parser";
import userRouter from "./routes/user.routes";
import habitsRouter from "./routes/habits.routes";
import { corsOptions } from "./constants";

connectToMongo();
const app = express();

app.use(cors(corsOptions));
app.use(cookie());
app.use(express.json());

app.use("/auth", userRouter);
app.use("/habits", habitsRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log("Server running!!!");
});
