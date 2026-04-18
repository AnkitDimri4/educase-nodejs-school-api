import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import schoolsRouter from "./routes/schools.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "School Management API is running" });
});

app.use("/api", schoolsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});